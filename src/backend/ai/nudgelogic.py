def generate_nudges(user_data: dict, score_data: dict, twin_data: dict) -> list:
    nudges = []
    savings_runway  = score_data["savings_runway_months"]
    dti             = score_data["debt_to_income_ratio"]
    score           = score_data["score"]
    has_insurance   = user_data["has_insurance"]
    trend           = twin_data["trend"]
    twin_warnings   = twin_data.get("warnings", [])

    if savings_runway < 1:
        nudges.append({
            "id": "CRITICAL_RUNWAY", "severity": "CRITICAL", "icon": "🚨",
            "title": "Emergency Fund Critical",
            "message": f"Your savings only cover {savings_runway*30:.0f} days. Prioritize saving now.",
            "action": "View AI Advice"
        })
    elif savings_runway < 3:
        nudges.append({
            "id": "LOW_RUNWAY", "severity": "WARNING", "icon": "⚠️",
            "title": "Low Emergency Fund",
            "message": f"You can only survive {savings_runway} months without income. Target at least 3 months.",
            "action": "Create Savings Plan"
        })

    if dti > 40:
        nudges.append({
            "id": "HIGH_DTI", "severity": "CRITICAL", "icon": "💳",
            "title": "Dangerous Debt Burden",
            "message": f"{dti}% of your income goes to debt payments. Safe limit is 30%.",
            "action": "View Debt Optimizer"
        })
    elif dti > 25:
        nudges.append({
            "id": "MEDIUM_DTI", "severity": "WARNING", "icon": "📊",
            "title": "Watch Your Debt Load",
            "message": f"{dti}% of income goes to installments. Start reducing before it grows.",
            "action": "View Details"
        })

    if not has_insurance:
        nudges.append({
            "id": "NO_INSURANCE", "severity": "INFO", "icon": "🛡️",
            "title": "No Protection Coverage",
            "message": "You don't have insurance. One emergency could drain all your savings.",
            "action": "Learn About Insurance"
        })

    if trend == "NAIK":
        nudges.append({
            "id": "SPENDING_TREND_UP", "severity": "WARNING", "icon": "📈",
            "title": "Spending Keeps Rising",
            "message": "Your spending trend is increasing. You could be in deficit within 3 months.",
            "action": "View Projection"
        })

    for i, w in enumerate(twin_warnings):
        nudges.append({
            "id": f"TWIN_{w['type']}_{i}", "severity": "WARNING", "icon": "🔮",
            "title": "Financial Projection Issue",
            "message": w["message"],
            "action": "View Digital Twin"
        })

    order = {"CRITICAL": 0, "WARNING": 1, "INFO": 2}
    nudges.sort(key=lambda n: order[n["severity"]])
    return nudges