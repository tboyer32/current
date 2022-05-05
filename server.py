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

def get_usgs_inst(river):
    """query the usgs instantaneous value API"""

    usgs_id = river.usgs_id

    cfs_code = '00060'
    gage_code = '00065'
    temp_code = '00010'

    param_codes = f"{cfs_code},{gage_code},{temp_code}"

    url = 'https://waterservices.usgs.gov/nwis/iv/?format=json'
    payload = {'sites': usgs_id, 'parameterCD': param_codes}

    response = requests.get(url, params=payload)
    river_data = response.json()

    timeSeries = river_data['value']['timeSeries']
    river_name = timeSeries[0]["sourceInfo"]["siteName"]

    river_dict = {
        'name' : river_name,
        'usgs_id' : usgs_id,
        'river_id' : river.river_id
    }

    for param in timeSeries:
        var_code = param['variable']['variableCode'][0]['value']

        if var_code == cfs_code:
            river_dict['cfs'] = param['values'][0]['value'][0]['value']
        elif var_code == gage_code:
            river_dict['gage_height'] = param['values'][0]['value'][0]['value']
        elif var_code == temp_code:
            river_dict['temp'] = param['values'][0]['value'][0]['value']

    return river_dict


def get_weather_api(river):
    """get data from the open weather map api"""

    url = 'https://api.openweathermap.org/data/2.5/weather'
    payload = {'lat': river.latitude, 'lon': river.longitude, 'appid': OW_API_KEY}

    response = requests.get(url, params=payload)
    weather_data = response.json()

    weather = {
        'condition_id' : weather_data['weather'][0]['id'],
        'weather_desc' : weather_data['weather'][0]['description']
    }

    return weather


# ===========================================================================
# ROUTES
# ===========================================================================

@app.route('/')
def homepage():
    """Show homepage."""

    return render_template('homepage.html', mb_key=MB_API_KEY)


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


@app.route('/river-detail/<usgs_id>')
def river_detail(usgs_id):
    """Show a river detail page."""

    river = crud.get_river_by_usgs_id(usgs_id)
    river_data = get_usgs_inst(river)
    weather = get_weather_api(river)

    #handle favorites
    user_id = session.get('user_id', False)

    if(user_id):
        fav = crud.get_fav(user_id, river_data['river_id'])
    else:
        fav = False

    return render_template('river-detail.html', river_data=river_data, fav=fav, weather=weather)


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


@app.route('/view-favs', methods=['GET'])
def view_favs():
    """View favorite rivers"""

    #TODO
    #if the river has been favorited for more than one day show the change in river level since yesterday
    #opt in to notifications

    user_id = request.args.get('user-id')
    
    #values to pass in to crud to handle pagination
    current_page = request.args.get('page', 1, type=int)
    num_results = 10

    #values to pass into the template
    rivers = []
    id_list = []
    cfs_list = []

    #query the db
    user_favs = crud.get_favs_by_user(user_id, current_page, num_results)

    for fav in user_favs.items:
        #get a river from the USGS API using the usgs_id
        usgs_id = fav.river.usgs_id
        river = get_usgs_inst(fav.river)
        weather = get_weather_api(fav.river)
        river.update(weather)

        #append the river_dict returned from get_usgs_inst to the river list
        rivers.append(river)

        #append the usgs_id to the id list so that we can turn it into a string for the front end
        id_list.append(usgs_id)

        #get the cfs values from the river dict and add it to a list so we can format it for the front end
        cfs = river.get('cfs', 0)
        cfs_list.append(cfs)

    #format the lists into comma separated strings for js purposes
    usgs_ids = ",".join(id_list)
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

    return redirect('/')


@app.route('/logout', methods=["POST"])
def user_logout():
    """Log the user out"""

    session.pop('user_id')
    
    flash('You have been logged out!')

    return redirect('/')


if __name__ == '__main__':

    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
