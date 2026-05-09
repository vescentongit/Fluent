"""
ai/resilience_score.py
Algoritma Resilience Score (0–100) — Fluent
Empat pilar: Savings Runway, Income Stability, Debt Burden, Insurance Coverage
"""

import math
from typing import List


def calculate_resilience_score(
    total_savings: float,
    monthly_expenses: float,
    monthly_income: float,
    total_monthly_debt_payment: float,
    has_insurance: bool,
    income_history: List[float],  # income 3 bulan terakhir
) -> dict:
    """
    Menghitung Resilience Score user.

    Returns:
        dict dengan score (0-100), breakdown per pilar, dan savings_runway_months
    """

    # ── Pilar 1: Savings Runway ──────────────────────────────────
    # Berapa bulan user bisa survive tanpa income
    # 6 bulan = perfect score (100)
    if monthly_expenses > 0:
        savings_runway = total_savings / monthly_expenses
    else:
        savings_runway = 0

    savings_score = min(savings_runway / 6 * 100, 100)

    # ── Pilar 2: Income Stability ────────────────────────────────
    # Makin kecil std deviation income → makin stabil → makin tinggi skor
    if len(income_history) >= 2:
        mean = sum(income_history) / len(income_history)
        variance = sum((x - mean) ** 2 for x in income_history) / len(income_history)
        std_dev = math.sqrt(variance)
        if mean > 0:
            stability_score = max(0, 100 - (std_dev / mean) * 100)
        else:
            stability_score = 0
    else:
        stability_score = 50  # default jika data kurang

    # ── Pilar 3: Debt Burden ─────────────────────────────────────
    # Debt-to-Income ratio: <30% sehat, >50% kritis
    if monthly_income > 0:
        dti = total_monthly_debt_payment / monthly_income
    else:
        dti = 1.0  # worst case jika tidak ada income

    debt_score = max(0, 100 - (dti / 0.5) * 100)

    # ── Pilar 4: Insurance Coverage ──────────────────────────────
    insurance_score = 100 if has_insurance else 0

    # ── Weighted Average ─────────────────────────────────────────
    final_score = (
        savings_score * 0.35 +
        stability_score * 0.25 +
        debt_score * 0.25 +
        insurance_score * 0.15
    )
    final_score = round(final_score)

    # ── Warning Message ──────────────────────────────────────────
    warning = _build_warning(final_score, savings_runway, dti)

    return {
        "score": final_score,
        "savings_runway_months": round(savings_runway, 1),
        "breakdown": {
            "savings_score": round(savings_score, 1),
            "stability_score": round(stability_score, 1),
            "debt_score": round(debt_score, 1),
            "insurance_score": round(insurance_score, 1),
        },
        "warning_message": warning,
    }


def _build_warning(score: int, runway: float, dti: float) -> str:
    if runway < 1:
        return f"🚨 Tabunganmu hanya cukup untuk {runway:.1f} bulan tanpa income. Prioritaskan dana darurat!"
    elif runway < 3:
        return f"⚠️ Kamu bisa bertahan {runway:.1f} bulan tanpa income. Idealnya minimal 3 bulan."
    elif dti > 0.4:
        return f"⚠️ Cicilan hutangmu {dti*100:.0f}% dari income — beban yang cukup berat."
    elif score >= 75:
        return f"✅ Kondisi keuanganmu cukup sehat! Terus pertahankan kebiasaan ini."
    else:
        return f"📊 Resilience Score-mu {score}/100. Ada ruang untuk improvement di beberapa area."
