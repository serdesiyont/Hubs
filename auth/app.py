from flask import Flask
from datetime import timedelta
from extensions import ma, db, jwt
from jwt_auth import jwt_auth
from crud import crud
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.config["SECRET_KEY"] = "proghubs"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
app.config["JWT_IDENTITY_CLAIM"] = 'users.id'

db.init_app(app)
ma.init_app(app)
jwt.init_app(app)

app.register_blueprint(jwt_auth)
app.register_blueprint(crud)
if __name__ == "__main__":
    app.run()