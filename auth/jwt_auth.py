from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask import Blueprint, request, jsonify
from schema import UserCreationSchema
from extensions import db, pwd_context
from models import Users

jwt_auth = Blueprint("auth" ,__name__)

@jwt_auth.route('/register', methods=['POST'])
def register_user():
    if not request.is_json:
        return {"msg": "Request have to be JSON"}
    schema = UserCreationSchema()
    user = schema.load(request.json)
    db.session.add(user)
    db.session.commit()

    return {
        "Ac created": {
            "name": user.name,
            "email": user.email
        }
    }


@jwt_auth.route('/login', methods=['POST'])
def login_user():
    if not request.is_json:
        return {"msg": "Request have to be JSON"}

    email = request.json.get('email')
    password = request.json.get('password')

    user = Users.query.filter_by(email=email).first()

    
    
    if not user or not pwd_context.verify(password, user.password):
        return jsonify({"msg": "Bad credentials"}), 400
    
    at = create_access_token(str(user.id))
    rt = create_refresh_token(str(user.id))

    return jsonify(
        {"at": at,
        "rt": rt
        }
    )




@jwt_auth.route('/refresh_token', methods=['GET'])
@jwt_required(refresh=True)
def refresh_expired_token():
    user_id = get_jwt_identity()
    at = create_access_token(str(user_id))

    return jsonify({
        "id": user_id,
        "at": at
    })