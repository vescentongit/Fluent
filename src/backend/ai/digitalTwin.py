# ai/digital_twin.py
from datetime import datetime, timedelta
import random

def build_digital_twin(transactions: list, user: dict) -> dict:
    monthly_income = user["monthly_income"]
    total_savings  = user["total_savings"]

    daily_spending = _aggregate_daily(transactions)
    slope, intercept = _linear_regression(daily_spending)

    forecast = _forecast(len(daily_spending), slope, intercept, 90)
    savings_projection = _project_savings(forecast, monthly_income, total_savings)
    warnings = _detect_warnings(savings_projection)

    avg = sum(daily_spending) / len(daily_spending) if daily_spending else 0
    trend = "NAIK" if slope > 500 else "TURUN" if slope < -500 else "STABIL"

    return {
        "current_daily_avg": round(avg),
        "trend": trend,
        "savings_projection": savings_projection,
        "warnings": warnings,
        "summary": _summary(warnings, savings_projection)
    }

def _aggregate_daily(transactions):
    by_day = {}
    for t in transactions:
        day = t["date"][:10]
        by_day[day] = by_day.get(day, 0) + t["amount"]
    return [by_day[k] for k in sorted(by_day)]

def _linear_regression(data):
    n = len(data)
    if n == 0: return 0, 0
    x_sum  = sum(range(n))
    y_sum  = sum(data)
    xy_sum = sum(i * y for i, y in enumerate(data))
    x2_sum = sum(i * i for i in range(n))
    denom  = n * x2_sum - x_sum ** 2
    if denom == 0: return 0, y_sum / n
    slope     = (n * xy_sum - x_sum * y_sum) / denom
    intercept = (y_sum - slope * x_sum) / n
    return slope, intercept

def _forecast(start, slope, intercept, days):
    return [max(0, slope * (start + i) + intercept) for i in range(days)]

def _project_savings(forecast, monthly_income, current_savings):
    daily_income = monthly_income / 30
    savings = current_savings
    projection = []
    now = datetime.now()
    for month in range(3):
        month_days    = forecast[month*30:(month+1)*30]
        total_spending = sum(month_days)
        total_income   = daily_income * 30
        savings       += total_income - total_spending
        label = (now + timedelta(days=30*(month+1))).strftime("%B")
        projection.append({
            "month": month + 1,
            "label": label,
            "projected_savings": round(savings),
            "projected_spending": round(total_spending),
            "net_cash_flow": round(total_income - total_spending)
        })
    return projection

def _detect_warnings(projection):
    warnings = []
    for m in projection:
        if m["net_cash_flow"] < 0:
            warnings.append({
                "month": m["month"],
                "type": "CASH_FLOW_NEGATIF",
                "message": f"Bulan {m['label']}: pengeluaran melebihi income sebesar Rp {abs(m['net_cash_flow']):,}"
            })
    return warnings

def _summary(warnings, projection):
    if not warnings:
        last = projection[-1]
        return f"Proyeksi 3 bulan aman. Tabungan diperkirakan Rp {last['projected_savings']:,} di bulan ke-3."
    return f"Perhatian: {len(warnings)} bulan dengan cash flow negatif. {warnings[0]['message']}."

def generate_demo_transactions():
    transactions = []
    base = datetime.now() - timedelta(days=30)
    for i in range(30):
        date = (base + timedelta(days=i)).isoformat()
        amount = max(0, 50_000 + i * 1_500 + (random.random() - 0.5) * 20_000)
        transactions.append({"date": date, "amount": amount})
    return transactions