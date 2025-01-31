from extensions import ma
from marshmallow.fields import String
from marshmallow import validate, validates_schema, ValidationError
from models import Users

class UserCreationSchema(ma.SQLAlchemyAutoSchema):
    name = String(required=True, validate=validate.Length(min=4))
    email = String(required=True, validate=validate.Email())
    password = String(required=True)
    @validates_schema
    def email_validation(self, data, **kwargs):
        email = data.get('email')
        user = Users.query.filter_by(email=email).first()
        if user:
            raise ValidationError(f'{email} already used!')


    class Meta:
        model = Users
        load_instance = True
        