"""CRUD operations."""

from model import db, River, Fav, User, connect_to_db


def create_river(usgs_id, name, longitude, latitude):
    """Create and return a new movie."""

    river = River(usgs_id = usgs_id,
                  name = name,
                  longitude = longitude,
                  latitude = latitude)

    return river


def get_rivers(max_lat, min_lat, max_lng, min_lng):
    """get rivers within the map bounding box"""

    return River.query.filter(
        (River.latitude < max_lat) 
        & (River.latitude > min_lat) 
        & (River.longitude < max_lng) 
        & (River.longitude > min_lng)).all()


def create_user(username, email, password):
    """Create and return a new user."""

    user = User(username=username, email=email, password=password)

    return user


if __name__ == '__main__':
    from server import app
    connect_to_db(app)