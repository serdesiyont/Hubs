from extensions import db
from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.hybrid import hybrid_property
from extensions import pwd_context

class Users(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, nullable=False, unique=True)
    _password = Column(String, name='password')

    @hybrid_property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, raw_passowrd):
        self._password = pwd_context.hash(raw_passowrd)