function shouldSendNudge(currentData, previousData) {
    const triggers = [];

    // BNPL naik > 20% dari minggu lalu
    if (currentData.weeklyBnpl > previousData.weeklyBnpl * 1.2) {
        triggers.push({
        type: 'bnpl_spike',
        message: '⚠️ Pengeluaran BNPL kamu naik 20% minggu ini!'
        });
    }

    // Resilience Score turun > 10 poin
    if (currentData.resilienceScore < previousData.resilienceScore - 10) {
        triggers.push({
        type: 'score_drop',
        message: `📉 Resilience Score turun ke ${currentData.resilienceScore}. Cek Dashboard-mu.`
        });
    }

    // Savings Runway < 1 bulan
    if (currentData.savingsRunwayMonths < 1) {
        triggers.push({
        type: 'critical_runway',
        message: '🚨 Tabunganmu hanya cukup untuk kurang dari 1 bulan!'
        });
    }

    return triggers;
}