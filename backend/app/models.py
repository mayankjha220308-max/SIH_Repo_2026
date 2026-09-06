from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default='ARTISAN')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    artisan_profile = relationship('ArtisanProfile', back_populates='user', uselist=False)
    products = relationship('Product', back_populates='artisan')

class ArtisanProfile(Base):
    __tablename__ = 'artisan_profiles'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    craft_category = Column(String, nullable=True)
    location = Column(String, nullable=True)
    preferred_language = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='artisan_profile')

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True)
    artisan_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    name = Column(String, nullable=False)
    name_hi = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    material = Column(String, nullable=True)
    color = Column(String, nullable=True)
    size = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    production_cost = Column(Float, nullable=True)
    labour_cost = Column(Float, nullable=True)
    packaging_cost = Column(Float, nullable=True)
    selling_price = Column(Float, nullable=True)
    suggested_min_price = Column(Float, nullable=True)
    suggested_max_price = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    status = Column(String, nullable=False, default='DRAFT')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    artisan = relationship('User', back_populates='products')
