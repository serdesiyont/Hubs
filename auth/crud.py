from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
crud = Blueprint("crud", __name__)


@crud.route("/protected_route")
@jwt_required()
def need_permission():
    return jsonify({"msg": "Authenticated succesfully"})