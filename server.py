from flask import (Flask, render_template, request, flash, session, redirect)

from pprint import pformat
import os
import requests

app = Flask(__name__)
app.secret_key = "dev"

# This configuration for Flask interactive debugger
# TODO REMOVE IN PRODUCTION
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


OW_API_KEY = os.environ['OPEN_WEATHER_KEY']


@app.route('/')
def homepage():
    """Show homepage."""
    
    return render_template('homepage.html')


@app.route('/river-detail')
def river_detail():
    """Show a river detail page."""

    #https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05410490&parameterCd=00060,00065,63160,00010

    #animas
    site = '09361500'
    #Kickapoo
    #site = '05410490'
    #Wisconsin
    #site = '05404000'
    #St. Croix - has temp, cfs, gage height and stream height
    #site = '05340500'

    api_params = ['00060','00065','63160','00010']
    cfs_code, gage_code, st_level_code, temp_code = api_params

    param_codes = f"{cfs_code},{gage_code},{st_level_code},{temp_code}"

    url = 'https://waterservices.usgs.gov/nwis/iv/?format=json'
    payload = {'sites': site, 'parameterCD': param_codes}

    response = requests.get(url, params=payload)
    river_data = response.json()
    

    #TODO I feel like there should be an easier/more elegant way to do this.
    river = {}

    timeSeries = river_data['value']['timeSeries']

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


    return render_template('river-detail.html', river=river)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
