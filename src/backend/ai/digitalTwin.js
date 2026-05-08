// backend/ai/digitalTwin.js

/**
 * Digital Twin: prediksi kondisi keuangan user 90 hari ke depan
 * Analoginya seperti GPS — bukan hanya "kamu ada di sini",
 * tapi "kalau terus begini, 3 bulan lagi kamu sampai di sini"
 */

function buildDigitalTwin(transactions, userData) {
    const { monthlyIncome, totalSavings } = userData;

    // Step 1: Hitung pengeluaran harian dari data transaksi
    const dailySpending = aggregateDailySpending(transactions);

    // Step 2: Fit linear regression (y = mx + b)
    const { slope, intercept } = linearRegression(dailySpending);

    // Step 3: Forecast 90 hari ke depan
    const forecast = forecastNext90Days(dailySpending.length, slope, intercept);

    // Step 4: Hitung proyeksi tabungan
    const savingsProjection = projectSavings(
        forecast, monthlyIncome, totalSavings
    );

    // Step 5: Deteksi warning bulan-bulan berbahaya
    const warnings = detectWarnings(savingsProjection);

    return {
        currentDailyAvg: parseFloat(calculateAverage(dailySpending).toFixed(0)),
        trend: slope > 500 ? 'NAIK' : slope < -500 ? 'TURUN' : 'STABIL',
        forecast: forecast.map(f => ({
        day: f.day,
        projectedDailySpending: Math.max(0, parseFloat(f.value.toFixed(0)))
        })),
        savingsProjection,
        warnings,
        summary: generateSummary(slope, savingsProjection, warnings)
    };
}

// ─── Helper Functions ────────────────────────────────────────

function aggregateDailySpending(transactions) {
  // Group transaksi per hari, jumlahkan
    const byDay = {};
    transactions.forEach(t => {
        const day = t.date.split('T')[0]; // ambil tanggal saja
        byDay[day] = (byDay[day] || 0) + t.amount;
    });

    // Sort by date, return sebagai array
    return Object.keys(byDay)
        .sort()
        .map(date => byDay[date]);
}

function linearRegression(data) {
    const n = data.length;
    if (n === 0) return { slope: 0, intercept: 0 };

    const xSum = data.reduce((sum, _, i) => sum + i, 0);
    const ySum = data.reduce((sum, y) => sum + y, 0);
    const xySum = data.reduce((sum, y, i) => sum + i * y, 0);
    const x2Sum = data.reduce((sum, _, i) => sum + i * i, 0);

    const denom = n * x2Sum - xSum * xSum;
    if (denom === 0) return { slope: 0, intercept: ySum / n };

    const slope = (n * xySum - xSum * ySum) / denom;
    const intercept = (ySum - slope * xSum) / n;

    return { slope, intercept };
}

function forecastNext90Days(startDay, slope, intercept) {
    const forecast = [];
    for (let i = 0; i < 90; i++) {
        forecast.push({
        day: startDay + i,
        value: slope * (startDay + i) + intercept
        });
    }
    return forecast;
}

function projectSavings(forecast, monthlyIncome, currentSavings) {
    const dailyIncome = monthlyIncome / 30;
    let savings = currentSavings;
    const projection = [];

    // Groupkan per bulan (30 hari)
    for (let month = 0; month < 3; month++) {
        const monthDays = forecast.slice(month * 30, (month + 1) * 30);
        const totalSpending = monthDays.reduce((sum, d) => sum + Math.max(0, d.value), 0);
        const totalIncome = dailyIncome * 30;
        savings += totalIncome - totalSpending;

        projection.push({
        month: month + 1,
        label: getMonthLabel(month),
        projectedSavings: Math.round(savings),
        projectedSpending: Math.round(totalSpending),
        netCashFlow: Math.round(totalIncome - totalSpending)
        });
    }

    return projection;
}

function detectWarnings(savingsProjection) {
    const warnings = [];

    savingsProjection.forEach(month => {
        if (month.projectedSavings < 0) {
        warnings.push({
            month: month.month,
            type: 'DEFISIT',
            message: `Bulan ${month.label}: tabungan bisa minus Rp ${Math.abs(month.projectedSavings).toLocaleString('id-ID')}`
        });
        } else if (month.netCashFlow < 0) {
        warnings.push({
            month: month.month,
            type: 'CASH_FLOW_NEGATIF',
            message: `Bulan ${month.label}: pengeluaran melebihi income sebesar Rp ${Math.abs(month.netCashFlow).toLocaleString('id-ID')}`
        });
        }
    });

    return warnings;
}

function generateSummary(slope, savingsProjection, warnings) {
    const lastMonth = savingsProjection[2];

    if (warnings.length === 0) {
        return `Proyeksi 3 bulan ke depan terlihat aman. Tabungan diperkirakan mencapai Rp ${lastMonth.projectedSavings.toLocaleString('id-ID')} di bulan ke-3.`;
    }

    return `Perhatian: ada ${warnings.length} bulan dengan cash flow negatif. ${warnings[0].message}.`;
    }

    function calculateAverage(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    function getMonthLabel(index) {
    const now = new Date();
    now.setMonth(now.getMonth() + index + 1);
    return now.toLocaleString('id-ID', { month: 'long' });
    }

module.exports = { buildDigitalTwin };