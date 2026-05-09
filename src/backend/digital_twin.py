"""
ai/digital_twin.py
Digital Twin — Linear regression forecasting 90 hari ke depan
Berdasarkan 30 hari data pengeluaran terakhir
"""

from typing import List
from datetime import datetime


def forecast_spending(transactions: List[dict], days_ahead: int = 90) -> dict:
    """
    Forecast pengeluaran 90 hari ke depan menggunakan linear regression.

    Args:
        transactions: list of {"date": datetime, "amount": float}
        days_ahead: berapa hari ke depan yang di-forecast

    Returns:
        dict dengan forecast, total proyeksi, warning months, dan trend
    """
    if len(transactions) < 2:
        return {
            "forecast": [],
            "total_projected_90_days": 0,
            "warning_months": [],
            "trend": "stable",
            "error": "Data transaksi tidak cukup (minimal 2 hari)"
        }

    # Sort by date dan ambil amount per hari
    sorted_txs = sorted(transactions, key=lambda x: x["date"])
    amounts = [float(t["amount"]) for t in sorted_txs]
    n = len(amounts)

    # ── Linear Regression: y = mx + b ───────────────────────────
    x_vals = list(range(n))
    x_sum = sum(x_vals)
    y_sum = sum(amounts)
    xy_sum = sum(i * amounts[i] for i in x_vals)
    x2_sum = sum(i * i for i in x_vals)

    denominator = n * x2_sum - x_sum ** 2
    if denominator == 0:
        m = 0
        b = y_sum / n if n > 0 else 0
    else:
        m = (n * xy_sum - x_sum * y_sum) / denominator
        b = (y_sum - m * x_sum) / n

    # ── Forecast ke depan ────────────────────────────────────────
    forecast = []
    total = 0
    warning_months = []
    monthly_threshold = sum(amounts) / (n / 30) * 1.2 if n >= 7 else None  # 20% diatas avg

    for day in range(n, n + days_ahead):
        projected = max(0, m * day + b)  # tidak bisa negatif
        forecast.append({"day": day - n + 1, "projected_spending": round(projected, 2)})
        total += projected

        # Cek per bulan (30 hari)
        month_num = (day - n) // 30 + 1
        if monthly_threshold and projected * 30 > monthly_threshold and month_num not in warning_months:
            warning_months.append(month_num)

    # ── Trend Classification ─────────────────────────────────────
    if m > amounts[0] * 0.01:
        trend = "increasing"
    elif m < -amounts[0] * 0.01:
        trend = "decreasing"
    else:
        trend = "stable"

    return {
        "forecast": forecast,
        "total_projected_90_days": round(total, 2),
        "warning_months": warning_months,
        "trend": trend,
    }
