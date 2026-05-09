// backend/ai/nudgeLogic.js

/**
 * Nudge Logic: analisis data user dan return daftar peringatan
 * Analoginya seperti dokter yang baca hasil lab —
 * dia tahu parameter mana yang bahaya dan harus dikasih tahu pasien
 */

function generateNudges(userData, scoreData, twinData) {
    const nudges = [];

    const {
        totalMonthlyDebtPayment,
        monthlyIncome,
        totalBNPLDebt,
        hasInsurance
    } = userData;

    const { score, savingsRunwayMonths, debtToIncomeRatio } = scoreData;
    const { trend, warnings: twinWarnings } = twinData;

  // ─── Rule 1: Savings Runway Kritis ───────────────────────
    if (savingsRunwayMonths < 1) {
        nudges.push({
        id: 'CRITICAL_RUNWAY',
        severity: 'CRITICAL',
        icon: '🚨',
        title: 'Tabungan Darurat Kritis',
        message: `Tabunganmu hanya cukup untuk ${(savingsRunwayMonths * 30).toFixed(0)} hari. Prioritaskan menabung sekarang.`,
        action: 'Lihat Saran Kami'
        });
    } else if (savingsRunwayMonths < 3) {
        nudges.push({
        id: 'LOW_RUNWAY',
        severity: 'WARNING',
        icon: '⚠️',
        title: 'Tabungan Darurat Rendah',
        message: `Kamu hanya bisa bertahan ${savingsRunwayMonths} bulan tanpa income. Target minimal 3 bulan.`,
        action: 'Buat Rencana Tabungan'
        });
    }

  // ─── Rule 2: Debt-to-Income Terlalu Tinggi ───────────────
    if (debtToIncomeRatio > 40) {
        nudges.push({
        id: 'HIGH_DTI',
        severity: 'CRITICAL',
        icon: '💳',
        title: 'Beban Hutang Berbahaya!',
        message: `${debtToIncomeRatio}% income-mu habis untuk bayar hutang. Batas aman adalah 30%.`,
        action: 'Lihat Debt Optimizer'
        });
    } else if (debtToIncomeRatio > 25) {
        nudges.push({
        id: 'MEDIUM_DTI',
        severity: 'WARNING',
        icon: '📊',
        title: 'Perhatikan Beban Hutang',
        message: `${debtToIncomeRatio}% income-mu untuk cicilan. Mulai kurangi sebelum bertambah.`,
        action: 'Lihat Detail'
        });
    }

  // ─── Rule 3: Tidak Punya Asuransi ────────────────────────
    if (!hasInsurance) {
        nudges.push({
        id: 'NO_INSURANCE',
        severity: 'INFO',
        icon: '🛡️',
        title: 'Tidak Ada Perlindungan',
        message: 'Kamu belum punya asuransi. Satu kejadian darurat bisa menguras semua tabunganmu.',
        action: 'Pelajari Asuransi'
        });
    }

    // ─── Rule 4: Resilience Score Rendah ─────────────────────
    if (score < 30) {
        nudges.push({
        id: 'CRITICAL_SCORE',
        severity: 'CRITICAL',
        icon: '📉',
        title: 'Resilience Score Sangat Rendah',
        message: `Score kamu ${score}/100. Kondisi keuanganmu membutuhkan perhatian segera.`,
        action: 'Lihat Rekomendasi'
        });
    }

  // ─── Rule 5: Digital Twin Warning ────────────────────────
    if (trend === 'NAIK') {
        nudges.push({
        id: 'SPENDING_TREND_UP',
        severity: 'WARNING',
        icon: '📈',
        title: 'Pengeluaran Terus Naik',
        message: 'Tren pengeluaranmu meningkat. Jika dibiarkan, keuanganmu bisa defisit dalam 3 bulan.',
        action: 'Lihat Proyeksi'
        });
    }

    if (twinWarnings && twinWarnings.length > 0) {
        twinWarnings.forEach((w, index) => {
        nudges.push({
            id: `TWIN_${w.type}_${index}`,
            severity: 'WARNING',
            icon: '🔮',
            title: 'Proyeksi Keuangan Bermasalah',
            message: w.message,
            action: 'Lihat Dompet Virtualmu'
        });
        });
    }

    // Sort: CRITICAL dulu, lalu WARNING, lalu INFO
    const order = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    nudges.sort((a, b) => order[a.severity] - order[b.severity]);

    return nudges;
}

module.exports = { generateNudges };