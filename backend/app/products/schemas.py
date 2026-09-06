from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    material: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None
    quantity: Optional[int] = 0
    production_cost: Optional[float] = None
    labour_cost: Optional[float] = None
    packaging_cost: Optional[float] = None
    selling_price: Optional[float] = None

class ProductUpdate(BaseModel):
    name: Optional[str]
    category: Optional[str]
    material: Optional[str]
    color: Optional[str]
    size: Optional[str]
    quantity: Optional[int]
    production_cost: Optional[float]
    labour_cost: Optional[float]
    packaging_cost: Optional[float]
    selling_price: Optional[float]
    status: Optional[str]

class ProductOut(BaseModel):
    id: int
    artisan_id: int
    name: str
    category: Optional[str]
    material: Optional[str]
    color: Optional[str]
    size: Optional[str]
    quantity: int
    selling_price: Optional[float]
    image_url: Optional[str]
    status: str

    class Config:
        orm_mode = True
