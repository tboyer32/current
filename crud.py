"""CRUD operations."""

from model import db, River, Fav, User, connect_to_db


def create_river(usgs_id, longitude, latitude):
    """Create and return a new movie."""

    river = River(usgs_id = usgs_id,
                  longitude = longitude,
                  latitude = latitude)

    return river


def create_user(username, email, password):
    """Create and return a new user."""

    user = User(username=username, email=email, password=password)

    return user


if __name__ == '__main__':
    from server import app
    connect_to_db(app)