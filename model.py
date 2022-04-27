"""Models for riverdb."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class River(db.Model):
    """A River."""

    __tablename__ = 'rivers'

    river_id = db.Column(db.Integer,
                         autoincrement=True,
                         primary_key=True)
    name = db.Column(db.String, nullable=False)
    usgs_id = db.Column(db.String, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    prev_level = db.Column(db.Float, nullable=True)
    prev_rain = db.Column(db.Float, nullable=True)

    #backref Favs

    def __repr__(self):
        return f"<River id = {self.river_id} name = {self.name} usgs_id = {self.usgs_id}>"


class User(db.Model):
    """A user"""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer,
                         autoincrement=True,
                         primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=True)

    #backref Favs

    def __repr__(self):
        return f"<User user_id = {self.user_id} email = {self.email}>"


class Fav(db.Model):
    """User's saved rivers"""

    __tablename__ = 'river_favs'

    fav_id = db.Column(db.Integer,
                         autoincrement=True,
                         primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey("users.user_id"))
    river_id = db.Column(db.Integer,
                        db.ForeignKey("rivers.river_id"))  

    user = db.relationship("User", backref="users")
    river = db.relationship("River", backref="rivers")

    def __repr__(self):
        return f"<Fav fav_id = {self.fav_id} user_id = {self.user_id} river_id = {self.river_id}>"


def connect_to_db(flask_app, db_uri="postgresql:///riverdb", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets too annoying; 
    connect_to_db(app)