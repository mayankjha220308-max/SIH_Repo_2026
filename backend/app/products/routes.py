from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from typing import List
import os
from .. import models
from ..products import schemas
from ..deps import get_db
from ..auth import utils as auth_utils

router = APIRouter(prefix="/api/products", tags=["products"]) 

# Helper to get current user from cookie or Authorization header
def _get_user_from_request(request: Request, db: Session):
    token = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]
    else:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = auth_utils.jwt.decode(token, auth_utils.settings.SECRET_KEY, algorithms=[auth_utils.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise Exception("Invalid token payload")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=schemas.ProductOut)
def create_product(product_in: schemas.ProductCreate, request: Request, db: Session = Depends(get_db)):
    user = _get_user_from_request(request, db)
    # Only artisans can create products
    if user.role != 'ARTISAN':
        raise HTTPException(status_code=403, detail="Only artisans can create products")
    product = models.Product(
        artisan_id=user.id,
        name=product_in.name,
        category=product_in.category,
        material=product_in.material,
        color=product_in.color,
        size=product_in.size,
        quantity=product_in.quantity or 0,
        production_cost=product_in.production_cost,
        labour_cost=product_in.labour_cost,
        packaging_cost=product_in.packaging_cost,
        selling_price=product_in.selling_price,
        status='DRAFT'
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/", response_model=List[schemas.ProductOut])
def list_products(artisan_id: int = None, db: Session = Depends(get_db)):
    q = db.query(models.Product)
    if artisan_id:
        q = q.filter(models.Product.artisan_id == artisan_id)
    else:
        q = q.filter(models.Product.status == 'PUBLISHED')
    return q.all()

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, product_in: schemas.ProductUpdate, request: Request, db: Session = Depends(get_db)):
    user = _get_user_from_request(request, db)
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.artisan_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")
    for field, value in product_in.dict(exclude_unset=True).items():
        setattr(product, field, value)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.post("/{product_id}/upload-image")
def upload_image(product_id: int, file: UploadFile = File(...), request: Request = None, db: Session = Depends(get_db)):
    # Authenticate
    user = _get_user_from_request(request, db)
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.artisan_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to upload image for this product")

    uploads_dir = os.path.join(os.getcwd(), 'backend', 'static', 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    filename = f"product_{product_id}_{file.filename}"
    file_path = os.path.join(uploads_dir, filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    # Save URL (served from /static/uploads/...)
    product.image_url = f"/static/uploads/{filename}"
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"image_url": product.image_url}

@router.get("/artisan/me", response_model=List[schemas.ProductOut])
def list_my_products(request: Request, db: Session = Depends(get_db)):
    user = _get_user_from_request(request, db)
    q = db.query(models.Product).filter(models.Product.artisan_id == user.id)
    return q.all()
