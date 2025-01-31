from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer
from flask_marshmallow import Marshmallow
from marshmallow import validate,validates_schema, ValidationError
from marshmallow.fields import String as Str

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
db = SQLAlchemy(app)
ma = Marshmallow(app)



class Users(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(55), nullable=False, unique=True)


    def __repr__(self) -> str:
        return f"{self.name}, {self.email}"
  
with app.app_context():
        db.create_all()

# validates the data recieved from client before executing on the db
class UserCreationSchema(ma.SQLAlchemyAutoSchema):
    name = Str(required=True, validate=validate.Length(min=4))
    email = Str(required=True, validate=validate.Email())

    @validates_schema
    def email_validation(self, data, **kwargs):
        email = data.get('email')
        user = Users.query.filter_by(email=email).first()
        if user:
            raise ValidationError(f'{email} already used!')


    class Meta:
        model = Users
        load_instance = True
        


@app.route('/users')
def get_all_user():
    users = Users.query.all()
    schema = UserCreationSchema()
    return schema.dump(users, many=True), 200

@app.route('/add', methods=['POST'])
def add_users():
    if not request.is_json:
        return {"msg": "Send JSON request"}
    schema = UserCreationSchema()
    new_user = schema.load(request.json)
    db.session.add(new_user)
    db.session.commit()

    return schema.dump(new_user), 201


@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = Users.query.get(id)
    if not user:
        return {"msg": "User not found"}, 404
    db.session.delete(user)
    db.session.commit()
    return {"msg": f"User with ID {id} deleted successfully"}, 200




if __name__ == "__main__":
    app.run()
     
