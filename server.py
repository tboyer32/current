from flask import (Flask, render_template, request, flash, session, redirect, jsonify)

import os
import requests

from model import connect_to_db, db
import crud

app = Flask(__name__)
app.secret_key = "dev"

# This configuration for Flask interactive debugger
# TODO REMOVE IN PRODUCTION
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


OW_API_KEY = os.environ['OPEN_WEATHER_KEY']
MB_API_KEY = os.environ['MAPBOX_KEY']


@app.route('/')
def homepage():
    """Show homepage."""

    return render_template('homepage.html', mb_key=MB_API_KEY)


@app.route('/rivers') 
def river_locations():
    """return locations of nearby rivers"""

    #this will eventually run a database query against the user's map lat and long bounding box
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

    #https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05410490&parameterCd=00060,00065,63160,00010

    #animas
    #site = '09361500'
    #Kickapoo
    #site = '05410490'
    #Wisconsin
    #site = '05404000'
    #St. Croix - has temp, cfs, gage height and stream height
    #site = '05340500'

    site = usgs_id

    api_params = ['00060','00065','63160','00010']
    cfs_code, gage_code, st_level_code, temp_code = api_params

    param_codes = f"{cfs_code},{gage_code},{st_level_code},{temp_code}"

    url = 'https://waterservices.usgs.gov/nwis/iv/?format=json'
    payload = {'sites': site, 'parameterCD': param_codes}

    response = requests.get(url, params=payload)
    river_data = response.json()
    

    #TODO I feel like there should be an easier/more elegant way to do this.
    timeSeries = river_data['value']['timeSeries']
    river_name = timeSeries[0]["sourceInfo"]["siteName"]

    river = {
        'name': river_name
    }

    for param in timeSeries:
        var_code = param['variable']['variableCode'][0]['value']

        if var_code == cfs_code:
            river['cfs'] = param['values'][0]['value'][0]['value']
        elif var_code == gage_code:
            river['gage_height'] = param['values'][0]['value'][0]['value']
        elif var_code == st_level_code:
            river['stream_level'] = param['values'][0]['value'][0]['value']
        elif var_code == temp_code:
            river['temp'] = param['values'][0]['value'][0]['value']


    return render_template('river-detail.html', river=river, usgs_id=site)


@app.route('/create-account')
def create_account():
    """Create an account"""

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
        flash('Account created successfully')

    return redirect('/')


if __name__ == '__main__':

    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
