from flask import (Flask, render_template, request, flash, session, redirect, jsonify, make_response)

import os
import requests
import jwt
from datetime import datetime, timedelta
from functools import wraps

from model import connect_to_db, db
import crud

app = Flask(__name__)
#app.secret_key = "dev"

# This configuration is for Flask interactive debugger
# TODO REMOVE IN PRODUCTION
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True
app.config['SECRET_KEY'] = "dev"

# decorator for verifying the JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # jwt is passed in the request header
        print(request.headers)
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        # return 401 if token is not passed
        if not token:
            return ({'message' : 'Token is missing !!'})
  
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = data['user_id']

        except:
            return ({
                'message' : 'Token is invalid !!'
            })

        # returns the current logged in users contex to the routes
        return  f(user_id, *args, **kwargs)
  
    return decorated






# ===========================================================================
# API Requests
# ===========================================================================


OW_API_KEY = os.environ['OPEN_WEATHER_KEY']
MB_API_KEY = os.environ['MAPBOX_KEY']


def get_usgs_inst(usgs_ids, river_list):
    """query the usgs instantaneous value API"""

    url = 'https://waterservices.usgs.gov/nwis/iv/?format=json'
    payload = {'sites' : usgs_ids, 'parameterCD' : '00060'}

    response = requests.get(url, params=payload)
    river_data = response.json()

    #process response from API
    cfs_list = []

    timeSeries = river_data['value']['timeSeries']

    for param in timeSeries:
        cfs_dict = {
            'usgs_id': param['sourceInfo']['siteCode'][0]['value'],
            'cfs': param['values'][0]['value'][0]['value']
        }
        cfs_list.append(cfs_dict)

    for river in river_list:
        for cfs in cfs_list:
            if river['usgs_id'] == cfs['usgs_id']:
                river.update(cfs)

    return river_list


# ===========================================================================
# FORMS
# ===========================================================================


@app.route('/create-account')
def create_account():
    """Create an account page"""

    return render_template('create-account.html')


@app.route('/register-user', methods=['POST'])
def register_user():
    """Register a user"""

    username = request.json.get('username')
    email = request.json.get('email')
    phone = request.json.get('phone')
    password = request.json.get('password')

    if (crud.get_user_by_email(email)):
        return make_response('User already exists. Please Log in.', 202)
    else:
        user = crud.create_user(username, email, phone, password)
        db.session.add(user)
        db.session.commit()

        user_id = user.user_id
        session['user_id'] = user_id

        return {'message' : 'Account Creation Successful!'}


@app.route('/login', methods =['POST'])
def login():

    email = request.json.get('email', 0)
    password = request.json.get('password', 0)

    verified_user = crud.verify_user(email, password)

    if not verified_user:
        # returns 401 if user does not exist
        #######TODO Return something more user friendly#########
        return {'message' : 'Wrong Username or Password!"'}
        
    else:
        # generates the JWT Token
        dt = datetime.now() + timedelta(days=60)
        token = jwt.encode({
            'user_id': verified_user.user_id,
            'exp' : dt.utcfromtimestamp(dt.timestamp())
        }, app.config['SECRET_KEY'], algorithm="HS256")

        fav_rivers = crud.get_favs_by_user(verified_user.user_id)

        favorites = []

        for fav in fav_rivers:
            favorites.append(fav.river.usgs_id)

        return make_response(jsonify({'token' : token, 'favorites' : favorites}), 201)


@app.route('/fav-river', methods=["POST"])
@token_required
def fav_river(user_id):
    """Add a river to favorites"""

    usgs_id = request.json.get('usgsId', 0)

    river = crud.get_river_by_usgs_id(usgs_id)
    river_id = river.river_id
    
    fav = crud.create_fav(user_id, river_id)

    db.session.add(fav)
    db.session.commit()

    return {'message' : 'Favorite added successfully'}


@app.route('/unfav-river', methods=["POST"])
@token_required
def unfav_river(user_id):
    """Remove a river from favorites"""

    usgs_id = request.json.get('usgsId', 0)

    river = crud.get_river_by_usgs_id(usgs_id)
    river_id = river.river_id
    
    fav = crud.get_fav(user_id, river_id)

    db.session.delete(fav)
    db.session.commit()

    return {'message' : 'Favorite removed successfully'}


# ===========================================================================
# JSON RESPONSES
# ===========================================================================

@app.route('/test')
@token_required
def test(user_id):
    """just testing react"""

    return {"message" : user_id}


@app.route('/locate-rivers.json') 
def locate_rivers():
    """return locations of nearby rivers"""

    max_lat = float(request.args.get('maxLat'))
    min_lat = float(request.args.get('minLat'))
    max_lng = float(request.args.get('maxLng'))
    min_lng = float(request.args.get('minLng'))

    locations = {}

    river_results = crud.get_rivers(max_lat, min_lat, max_lng, min_lng)

    for river in river_results:
        locations[river.name] = {'usgs_id': river.usgs_id, 'latitude': river.latitude, 'longitude': river.longitude}

    return jsonify(locations)


@app.route('/view-favs.json', methods=['POST'])
@token_required
def view_favs(user_id):
    """View favorite rivers"""

    #query the db
    current_page = request.json.get('page', 1)
    num_results = 10

    user_favs = crud.get_favs_by_user_pag(user_id, current_page, num_results)

    usgs_ids = []

    for fav in user_favs.items:
        usgs_ids.append(fav.river.usgs_id)

    #pagination for template
    #TODO turn into a list
    next_page = False
    prev_page = False

    if user_favs.has_next:
        next_page = user_favs.next_num
    if user_favs.has_prev:
        prev_page = user_favs.prev_num

    return {"usgsIds" : usgs_ids, "nextPage" : next_page, "prevPage" : prev_page}


@app.route('/weather.json')
def get_weather():

    lat = request.args.get('lat')
    lon = request.args.get('lon')

    url = 'https://api.openweathermap.org/data/2.5/weather'
    payload = {'lat': lat, 'lon': lon, 'appid': OW_API_KEY}

    response = requests.get(url, params=payload)
    weather_data = response.json()

    weather = {
        'condition_id' : weather_data['weather'][0]['id'],
        'weather_desc' : weather_data['weather'][0]['description']
    }

    return jsonify(weather)


if __name__ == '__main__':

    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
