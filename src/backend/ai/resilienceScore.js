// backend/ai/resilienceScore.js

/**
 * Menghitung Resilience Score user (0–100)
 * Analoginya seperti "credit score" tapi untuk melindungi user, bukan bank
 */

function calculateResilienceScore(userData) {
    const {
        totalSavings,           // total tabungan (Rp)
        monthlyExpenses,        // rata-rata pengeluaran per bulan (Rp)
        monthlyIncome,          // income per bulan (Rp)
        totalMonthlyDebtPayment,// total cicilan per bulan (BNPL + dll)
        hasInsurance,           // boolean
        incomeHistory           // array income 3 bulan terakhir, contoh: [4800000, 5000000, 5200000]
    } = userData;

  // ─────────────────────────────────────────
  // PILAR 1: Savings Runway (bobot 35%)
  // "Berapa bulan kamu bisa survive tanpa income?"
  // ─────────────────────────────────────────
    const savingsRunwayMonths = totalSavings / monthlyExpenses;
    // 0 bulan = 0 poin, 6 bulan atau lebih = 100 poin
    const savingsScore = Math.min((savingsRunwayMonths / 6) * 100, 100);

  // ─────────────────────────────────────────
  // PILAR 2: Income Stability (bobot 25%)
  // "Seberapa konsisten income-mu?"
  // ─────────────────────────────────────────
    let stabilityScore = 100; // default jika hanya 1 data
    if (incomeHistory && incomeHistory.length > 1) {
        const mean = incomeHistory.reduce((a, b) => a + b, 0) / incomeHistory.length;
        const variance = incomeHistory.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / incomeHistory.length;
        const stdDev = Math.sqrt(variance);
        const coefficientOfVariation = stdDev / mean; // 0 = sangat stabil, >1 = sangat tidak stabil
        stabilityScore = Math.max(0, 100 - coefficientOfVariation * 200);
    }

  // ─────────────────────────────────────────
  // PILAR 3: Debt Burden (bobot 25%)
  // "Seberapa berat beban hutangmu?"
  // Debt-to-Income ratio: <30% sehat, >50% bahaya
  // ─────────────────────────────────────────
    const debtToIncomeRatio = totalMonthlyDebtPayment / monthlyIncome;
  // 0% = 100 poin, 50% atau lebih = 0 poin
    const debtScore = Math.max(0, 100 - (debtToIncomeRatio / 0.5) * 100);

  // ─────────────────────────────────────────
  // PILAR 4: Insurance Coverage (bobot 15%)
  // Sederhana untuk hackathon: punya = 100, tidak = 0
  // ─────────────────────────────────────────
    const insuranceScore = hasInsurance ? 100 : 0;

  // ─────────────────────────────────────────
  // FINAL SCORE (weighted average)
  // ─────────────────────────────────────────
    const finalScore = (
        savingsScore    * 0.35 +
        stabilityScore  * 0.25 +
        debtScore       * 0.25 +
        insuranceScore  * 0.15
    );

    const score = Math.round(finalScore);

  // Generate warning message untuk UI
    const warningMessage = generateWarning(score, savingsRunwayMonths, debtToIncomeRatio);

    return {
        score,
        savingsRunwayMonths: parseFloat(savingsRunwayMonths.toFixed(1)),
        debtToIncomeRatio: parseFloat((debtToIncomeRatio * 100).toFixed(1)), // dalam %
        breakdown: {
        savingsScore:   Math.round(savingsScore),
        stabilityScore: Math.round(stabilityScore),
        debtScore:      Math.round(debtScore),
        insuranceScore: Math.round(insuranceScore),
        },
        warningMessage,
        riskLevel: getRiskLevel(score),
    };
}

function getRiskLevel(score) {
    if (score >= 75) return 'AMAN';
    if (score >= 50) return 'WASPADA';
    if (score >= 25) return 'BERISIKO';
    return 'KRITIS';
}

function generateWarning(score, savingsRunwayMonths, dtiRatio) {
    if (savingsRunwayMonths < 1) {
        return `Tabunganmu hanya cukup untuk ${(savingsRunwayMonths * 30).toFixed(0)} hari. Ini darurat.`;
    }
    if (dtiRatio > 0.4) {
        return `${(dtiRatio * 100).toFixed(0)}% income-mu habis untuk bayar hutang. Di atas batas aman.`;
    }
    if (score < 50) {
        return `Kamu bisa bertahan ${savingsRunwayMonths} bulan tanpa income. Perlu tindakan segera.`;
    }
    return `Kondisi keuanganmu cukup stabil. Kamu bisa bertahan ${savingsRunwayMonths} bulan tanpa income.`;
}

module.exports = { calculateResilienceScore };