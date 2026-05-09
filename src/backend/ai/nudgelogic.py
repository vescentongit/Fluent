# ai/nudge_logic.py

def generate_nudges(user_data: dict, score_data: dict, twin_data: dict) -> list:
    nudges = []

    savings_runway  = score_data["savings_runway_months"]
    dti             = score_data["debt_to_income_ratio"]  # dalam %
    score           = score_data["score"]
    has_insurance   = user_data["has_insurance"]
    trend           = twin_data["trend"]
    twin_warnings   = twin_data.get("warnings", [])

    if savings_runway < 1:
        nudges.append({
            "id": "CRITICAL_RUNWAY", "severity": "CRITICAL", "icon": "🚨",
            "title": "Tabungan Darurat Kritis",
            "message": f"Tabunganmu hanya cukup {savings_runway*30:.0f} hari. Prioritaskan menabung.",
            "action": "Lihat Saran AI"
        })
    elif savings_runway < 3:
        nudges.append({
            "id": "LOW_RUNWAY", "severity": "WARNING", "icon": "⚠️",
            "title": "Tabungan Darurat Rendah",
            "message": f"Kamu hanya bisa bertahan {savings_runway} bulan tanpa income. Target minimal 3 bulan.",
            "action": "Buat Rencana Tabungan"
        })

    if dti > 40:
        nudges.append({
            "id": "HIGH_DTI", "severity": "CRITICAL", "icon": "💳",
            "title": "Beban Hutang Berbahaya",
            "message": f"{dti}% income-mu habis untuk bayar hutang. Batas aman adalah 30%.",
            "action": "Lihat Debt Optimizer"
        })
    elif dti > 25:
        nudges.append({
            "id": "MEDIUM_DTI", "severity": "WARNING", "icon": "📊",
            "title": "Perhatikan Beban Hutang",
            "message": f"{dti}% income-mu untuk cicilan. Mulai kurangi sebelum bertambah.",
            "action": "Lihat Detail"
        })

    if not has_insurance:
        nudges.append({
            "id": "NO_INSURANCE", "severity": "INFO", "icon": "🛡️",
            "title": "Tidak Ada Perlindungan",
            "message": "Kamu belum punya asuransi. Satu kejadian darurat bisa menguras semua tabungan.",
            "action": "Pelajari Asuransi"
        })

    if trend == "NAIK":
        nudges.append({
            "id": "SPENDING_TREND_UP", "severity": "WARNING", "icon": "📈",
            "title": "Pengeluaran Terus Naik",
            "message": "Tren pengeluaranmu meningkat. Bisa defisit dalam 3 bulan.",
            "action": "Lihat Proyeksi"
        })

    for i, w in enumerate(twin_warnings):
        nudges.append({
            "id": f"TWIN_{w['type']}_{i}", "severity": "WARNING", "icon": "🔮",
            "title": "Proyeksi Keuangan Bermasalah",
            "message": w["message"],
            "action": "Lihat Digital Twin"
        })

    order = {"CRITICAL": 0, "WARNING": 1, "INFO": 2}
    nudges.sort(key=lambda n: order[n["severity"]])
    return nudges