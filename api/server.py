from flask import (Flask, render_template, request, flash, session, redirect, jsonify)

import os
import requests

from model import connect_to_db, db
import crud

app = Flask(__name__)
app.secret_key = "dev"

# This configuration is for Flask interactive debugger
# TODO REMOVE IN PRODUCTION
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True



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
# ROUTES
# ===========================================================================

@app.route('/')
def homepage():
    """Show homepage."""

    return render_template('homepage.html', mb_key=MB_API_KEY)


@app.route('/river-detail/<usgs_id>')
def river_detail(usgs_id):
    """Show a river detail page."""

    river = crud.get_river_by_usgs_id(usgs_id)

    river_dict = {
        'name' : river.name,
        'usgs_id' : river.usgs_id,
        'river_id' : river.river_id
    }
    
    #call the apis
    river_list = [river_dict]

    river_data = get_usgs_inst(river_dict['usgs_id'], river_list)[0]

    #handle favorites
    user_id = session.get('user_id', False)

    if(user_id):
        fav = crud.get_fav(user_id, river_data['river_id'])
    else:
        fav = False

    return render_template('river-detail.html', river_data=river_data, fav=fav)


@app.route('/view-favs', methods=['GET'])
def view_favs():
    """View favorite rivers"""

    #TODO check if the user is logged in before displaying information

    user_id = request.args.get('user-id')

    #values used to query the API
    usgs_id_list = []
    river_list = []

    #query the db
    current_page = request.args.get('page', 1, type=int)
    num_results = 10

    user_favs = crud.get_favs_by_user(user_id, current_page, num_results)

    #process info from the db
    for fav in user_favs.items:
        river_dict = {}
        river_dict['name'] = fav.river.name
        river_dict['usgs_id'] = fav.river.usgs_id
        river_dict['river_id'] = fav.river.river_id

        #NEED TO MOVE WEATHER CALL TO FRONT END TO SPEED UP REQUEST
        # weather = get_weather_api(fav.river)
        # river_dict.update(weather)

        river_list.append(river_dict)
        usgs_id_list.append(fav.river.usgs_id)

    #query the API
    usgs_ids = ",".join(usgs_id_list)
    rivers = get_usgs_inst(usgs_ids, river_list)

    #cfs values to pass into the template
    cfs_list = []

    for river in rivers:
        cfs = river.get('cfs', 0)
        cfs_list.append(cfs)

    cfs_values = ",".join(cfs_list)

    #pagination for template
    #TODO turn into a list
    next_page = False
    prev_page = False

    if user_favs.has_next:
        next_page = user_favs.next_num
    if user_favs.has_prev:
        prev_page = user_favs.prev_num

    return render_template('favorites.html', rivers=rivers, usgs_ids=usgs_ids, cfs_values=cfs_values, 
                            prev_page=prev_page, next_page=next_page, user_id=user_id)


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

    username = request.form.get('username')
    email = request.form.get('email')
    phone = request.form.get('phone')
    password = request.form.get('password')

    if (crud.get_user_by_email(email)):
        flash('User already exists')
    else:
        user = crud.create_user(username, email, phone, password)
        db.session.add(user)
        db.session.commit()

        user_id = user.user_id
        session['user_id'] = user_id

        flash('Account created successfully')

    return redirect('/')


@app.route('/login', methods=["POST"])
def user_login():
    """Verify user login"""

    email = request.form.get('email')
    password = request.form.get('password')

    verified_user = crud.verify_user(email, password)

    if verified_user:
        session['user_id'] = verified_user.user_id
        flash("Logged in!")
    else:
        flash('Login unsuccesful!')

    return redirect('request.referrer')


@app.route('/logout', methods=["POST"])
def user_logout():
    """Log the user out"""

    #TODO only redirect user if they're on the favorites page

    session.pop('user_id')
    
    flash('You have been logged out!')

    return redirect('/')


@app.route('/fav-river/<usgs_id>', methods=["POST"])
def fav_river(usgs_id):
    """Add a river to favorites"""

    user_id = session.get('user_id', False)
    river_id = request.form.get('river_id')
    
    fav = crud.create_fav(user_id, river_id)

    db.session.add(fav)
    db.session.commit()

    flash(f"River saved!")

    return redirect(request.referrer)


@app.route('/unfav-river/<usgs_id>', methods=["POST"])
def unfav_river(usgs_id):
    """Remove a river from favorites"""

    user_id = session.get('user_id', False)
    river_id = request.form.get('river_id')
    
    fav = crud.get_fav(user_id, river_id)

    db.session.delete(fav)
    db.session.commit()

    flash(f"River unsaved!")

    return redirect(request.referrer)


# ===========================================================================
# JSON RESPONSES
# ===========================================================================

@app.route('/test')
def test():
    """just testing react"""

    return {"message" : "Hello World"}


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


@app.route('/weather.json')
def get_weather():

    usgs_id = request.args.get('usgs-id')
    river = crud.get_river_by_usgs_id(usgs_id)

    url = 'https://api.openweathermap.org/data/2.5/weather'
    payload = {'lat': river.latitude, 'lon': river.longitude, 'appid': OW_API_KEY}

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
