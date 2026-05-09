# ai/resilience_score.py
import math

def calculate_resilience_score(user: dict) -> dict:
    total_savings              = user["total_savings"]
    monthly_expenses           = user["monthly_expenses"]
    monthly_income             = user["monthly_income"]
    total_monthly_debt_payment = user["total_monthly_debt_payment"]
    has_insurance              = user["has_insurance"]
    income_history             = user.get("income_history", [monthly_income])

    savings_runway = total_savings / monthly_expenses
    savings_score  = min((savings_runway / 6) * 100, 100)

    if len(income_history) > 1:
        mean    = sum(income_history) / len(income_history)
        std_dev = math.sqrt(sum((x - mean)**2 for x in income_history) / len(income_history))
        cv      = std_dev / mean
        stability_score = max(0, 100 - cv * 200)
    else:
        stability_score = 100

    dti        = total_monthly_debt_payment / monthly_income
    debt_score = max(0, 100 - (dti / 0.5) * 100)

    insurance_score = 100 if has_insurance else 0

    final_score = (
        savings_score    * 0.35 +
        stability_score  * 0.25 +
        debt_score       * 0.25 +
        insurance_score  * 0.15
    )
    score = round(final_score)

    # ← English risk levels
    risk_level = (
        "SAFE"     if score >= 75 else
        "CAUTION"  if score >= 50 else
        "AT RISK"  if score >= 25 else
        "CRITICAL"
    )

    # ← English warning messages
    if savings_runway < 1:
        warning = f"Your savings only last {savings_runway * 30:.0f} days. This is an emergency."
    elif dti > 0.4:
        warning = f"{dti*100:.0f}% of your income goes to debt payments. Above safe limit."
    else:
        warning = f"You can survive {savings_runway:.1f} months without income."

    return {
        "score": score,
        "savings_runway_months": round(savings_runway, 1),
        "debt_to_income_ratio": round(dti * 100, 1),
        "risk_level": risk_level,
        "warning_message": warning,
        "breakdown": {
            "savings_score":   round(savings_score),
            "stability_score": round(stability_score),
            "debt_score":      round(debt_score),
            "insurance_score": round(insurance_score),
        }
    }