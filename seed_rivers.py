"""Script to seed database."""

import os
import json
import requests

import crud
import model
import server

os.system('dropdb riverdb')
os.system('createdb riverdb')

model.connect_to_db(server.app)
model.db.create_all()

rivers_in_db = []

for filename in os.listdir("data"):
    with open(os.path.join("data", filename)) as river_file:
        raw_river_data = json.loads(river_file.read())

    timeSeries = raw_river_data['value']['timeSeries']

    for river in timeSeries:
        name = river['sourceInfo']['siteName']
        usgs_id = river['sourceInfo']['siteCode'][0]['value']
        longitude = river['sourceInfo']['geoLocation']['geogLocation']['longitude']
        latitude = river['sourceInfo']['geoLocation']['geogLocation']['latitude']
        
        cfs = float(river['values'][0]['value'][0]['value'])

        if cfs > 100:
            river_to_add = crud.create_river(usgs_id, name, longitude, latitude, cfs)
            rivers_in_db.append(river_to_add)

model.db.session.add_all(rivers_in_db)
model.db.session.commit()