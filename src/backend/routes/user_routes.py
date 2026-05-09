@app.put("/user/update")
def update_user(
    body: dict,
    current_user: models.User = Depends(get_user_saat_ini),
    db: Session = Depends(get_db)
):
    if "monthly_income" in body:
        current_user.monthly_income = float(body["monthly_income"])
    if "total_savings" in body:
        current_user.total_savings = float(body["total_savings"])
    if "has_insurance" in body:
        current_user.has_insurance = bool(body["has_insurance"])
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated", "monthly_income": current_user.monthly_income}