const BASE_URL = 'https://api.fluent.com'; // Nanti ganti dengan URL backend asli

export const getResilienceScore = async (userId) => {
  try {
    // Sementara pakai dummy data sesuai API Contract di PDF
    return {
      score: 67,
      savingsRunwayMonths: "1.8",
      breakdown: { savings: 5000000, expenses: 3000000 }
    };
    
    // Nanti kalau Backend sudah siap, tinggal ganti jadi:
    // const response = await fetch(`${BASE_URL}/api/resilience/${userId}`);
    // return await response.json();
  } catch (error) {
    console.error("Gagal ambil data Resilience:", error);
  }
};