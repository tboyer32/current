"""CRUD operations."""

from model import db, River, Fav, User, connect_to_db


def create_river(usgs_id, name, longitude, latitude):
    """Create and return a new river."""

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


def get_river_by_usgs_id(usgs_id):
    """Return river by usgs_id."""

    return River.query.filter(River.usgs_id == usgs_id).first()


def create_user(username, email, phone, password):
    """Create and return a new user."""

    user = User(username=username, email=email, phone=phone, password=password)

    return user


def verify_user(email, password):
    """Verify user login."""

    return User.query.filter(User.email == email, User.password == password).first()


def get_user_by_email(email):
    """Return user by email."""

    return User.query.filter(User.email == email).first()


def get_user_by_id(user_id):
    """Return user by id."""

    return User.query.get(user_id)


def create_fav(user_id, river_id):
    """fav a river"""

    fav = Fav(user_id=user_id, river_id=river_id)

    return fav


def get_fav(user_id, river_id):
    """get a fav"""

    return Fav.query.filter(Fav.user_id == user_id, Fav.river_id == river_id).first()


def get_favs_by_user(user_id):
    """get all the usgs_ids of favs by user"""

    user_favs = Fav.query.filter(Fav.user_id == user_id).options(db.joinedload('river')).all()
    
    return user_favs


if __name__ == '__main__':
    from server import app
    connect_to_db(app)