import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { 
    translation: { 
      settings: { appSettings: "App Settings", general: "General", account: "Account", security: "Security", notifications: "Notifications", subscription: "Subscription", support: "Support", help: "Help & Support", language: "Language", theme: "Theme", about: "About", selectLanguage: "Select Language", cancel: "Cancel" }, 
      languages: { en: "English", id: "Indonesian", ms: "Malay", tl: "Filipino", vi: "Vietnamese", th: "Thai", my: "Burmese", km: "Khmer", lo: "Lao" },
      nav: { home: "Home", wallet: "Wallet", learn: "Learn", profile: "Profile" },
      assets: {
        question1: "What", emphasis: "assets", question2: "do you currently own?",
        totalValue: "Total Asset Value", types: "Asset Types", progress: "3 out of 5",
        property: "Property", vehicle: "Vehicle", crypto: "Crypto", gold: "Gold", stocks: "Stocks/ETF", other: "Other"
      },
      chatbot: {
        title: "AI Financial Assistant", subtitle: "• Always Online For You", placeholder: "Ask your AI assistant anything...",
        initialMsg: "Hello! 👋 I'm Fluent AI, your personal financial assistant. I've analyzed your recent financial activity and prepared some personalized insights just for you. What would you like to explore today?",
        prompt1: "Evaluate my spending\nthis month", prompt2: "Help me use the\n50/30/20 rule", prompt3: "How do I start investing\nas a beginner?", prompt4: "What's the difference between\nregular saving and investing?", prompt5: "Tips to pay off Paylater\nso it doesn't pile up",
        replyDefault: "I'm here to help you achieve your financial resilience!",
        reply1: "Let's break it down together! This month, your biggest expense is in the Food & Beverage category (45%).\nWow, that's quite high! 🍔 If we cut back a little on your coffee and dining out budget, you could save around Rp400,000 this month.",
        reply2: "You got it! The 50/30/20 rule is a super easy way to manage your salary:\n50% Needs: Daily groceries, bills, transportation.\n30% Wants: Hangouts, skincare shopping, and Netflix subscriptions.\n20% Savings/Investments: Emergency fund, investments, and charity.",
        reply3: "Let's start with something low-risk! 📈\nI highly recommend Money Market Mutual Funds. It's like entrusting your money to a professional manager to put into bank deposits. The risk is very low, it's easy to withdraw at any time, and you can start with just Rp10,000!",
        reply4: "Great question! 💡\nSaving is about keeping your money safe (usually for the short term or emergencies). Unfortunately, the value of your money can be eroded by inflation (rising prices of goods).\nInvesting is putting your money to work so it grows faster to beat inflation.",
        reply5: "Don't panic, let's sort this out together! 💆‍♀️ There are two main tricks:\nStop using Paylater or any new credit cards for now.\nUse the Snowball Method: Focus on paying off the debt with the smallest balance first so you get a quick win and feel motivated."
      },
      auth: {
        welcomeBack: "Welcome Back!",
        username: "Username",
        password: "Password",
        loginBtn: "Login",
        forgotPassword: "Forgot your password?",
        noAccount: "Don't have an account?",
        registerNow: "Sign up here!"
      },
    } 
  },
  id: { 
    translation: { 
      settings: { appSettings: "Pengaturan Aplikasi", general: "Umum", account: "Akun", security: "Keamanan", notifications: "Notifikasi", subscription: "Langganan", support: "Dukungan", help: "Bantuan", language: "Bahasa", theme: "Tema", about: "Tentang", selectLanguage: "Pilih Bahasa", cancel: "Batal" }, 
      languages: { en: "Inggris", id: "Indonesia", ms: "Melayu", tl: "Filipina", vi: "Vietnam", th: "Thailand", my: "Myanmar", km: "Khmer", lo: "Laos" } 
    },
    auth: {
        welcomeBack: "Selamat Datang Kembali!",
        username: "Nama Pengguna",
        password: "Kata Sandi",
        loginBtn: "Masuk",
        forgotPassword: "Lupa kata sandi Anda?",
        noAccount: "Belum punya akun?",
        registerNow: "Daftar di sini!"
      },
  },
  ms: { 
    translation: { 
      settings: { appSettings: "Tetapan Aplikasi", general: "Umum", account: "Akaun", security: "Keselamatan", notifications: "Pemberitahuan", subscription: "Langganan", support: "Sokongan", help: "Bantuan", language: "Bahasa", theme: "Tema", about: "Mengenai", selectLanguage: "Pilih Bahasa", cancel: "Batal" }, 
      languages: { en: "Inggeris", id: "Indonesia", ms: "Melayu", tl: "Filipina", vi: "Vietnam", th: "Thai", my: "Myanmar", km: "Khmer", lo: "Laos" } 
    },
    auth: {
        welcomeBack: "Selamat Kembali!",
        username: "Nama Pengguna",
        password: "Kata Laluan",
        loginBtn: "Log Masuk",
        forgotPassword: "Lupa kata laluan anda?",
        noAccount: "Belum mempunyai akaun?",
        registerNow: "Daftar di sini!"
      },
  },
  tl: { 
    translation: { 
      settings: { appSettings: "Mga Setting", general: "Pangkalahatan", account: "Account", security: "Seguridad", notifications: "Mga Notipikasyon", subscription: "Subskripsyon", support: "Suporta", help: "Tulong", language: "Wika", theme: "Tema", about: "Tungkol sa", selectLanguage: "Piliin ang Wika", cancel: "Kanselahin" }, 
      languages: { en: "English", id: "Indonesian", ms: "Malay", tl: "Filipino", vi: "Vietnamese", th: "Thai", my: "Burmese", km: "Khmer", lo: "Lao" } 
    } 
  },
  vi: { 
    translation: { 
      settings: { appSettings: "Cài đặt ứng dụng", general: "Chung", account: "Tài khoản", security: "Bảo mật", notifications: "Thông báo", subscription: "Đăng ký", support: "Hỗ trợ", help: "Trợ giúp", language: "Ngôn ngữ", theme: "Chủ đề", about: "Giới thiệu", selectLanguage: "Chọn ngôn ngữ", cancel: "Hủy" }, 
      languages: { en: "Tiếng Anh", id: "Tiếng Indonesia", ms: "Tiếng Mã Lai", tl: "Tiếng Philippines", vi: "Tiếng Việt", th: "Tiếng Thái", my: "Tiếng Miến Điện", km: "Tiếng Khmer", lo: "Tiếng Lào" } 
    } 
  },
  th: { 
    translation: { 
      settings: { appSettings: "การตั้งค่าแอป", general: "ทั่วไป", account: "บัญชี", security: "ความปลอดภัย", notifications: "การแจ้งเตือน", subscription: "การสมัครสมาชิก", support: "การสนับสนุน", help: "ความช่วยเหลือ", language: "ภาษา", theme: "ธีม", about: "เกี่ยวกับ", selectLanguage: "เลือกภาษา", cancel: "ยกเลิก" }, 
      languages: { en: "อังกฤษ", id: "อินโดนีเซีย", ms: "มาเลย์", tl: "ฟิลิปปินส์", vi: "เวียดนาม", th: "ไทย", my: "พม่า", km: "เขมร", lo: "ลาว" } 
    } 
  },
  my: { 
    translation: { 
      settings: { appSettings: "အက်ပ်ဆက်တင်များ", general: "အထွေထွေ", account: "အကောင့်", security: "လုံခြုံရေး", notifications: "အသိပေးချက်များ", subscription: "စာရင်းသွင်းမှု", support: "ပံ့ပိုးမှု", help: "အကူအညီ", language: "ဘာသာစကား", theme: "အပြင်အဆင်", about: "အကြောင်း", selectLanguage: "ဘာသာစကားရွေးချယ်ပါ", cancel: "ပယ်ဖျက်ရန်" }, 
      languages: { en: "အင်္ဂလိပ်", id: "အင်ဒိုနီးရှား", ms: "မလေး", tl: "ဖိလစ်ပိုင်", vi: "ဗီယက်နမ်", th: "ထိုင်း", my: "မြန်မာ", km: "ခမာ", lo: "လာအို" } 
    } 
  },
  km: { 
    translation: { 
      settings: { appSettings: "ការកំណត់កម្មវិធី", general: "ទូទៅ", account: "គណនី", security: "សុវត្ថិភាព", notifications: "ការជូនដំណឹង", subscription: "ការជាវ", support: "ជំនួយ", help: "ជំនួយ", language: "ភាសា", theme: "រចនាប័ទ្ម", about: "អំពី", selectLanguage: "ជ្រើសរើសភាសា", cancel: "បោះបង់" }, 
      languages: { en: "អង់គ្លេស", id: "ឥណ្ឌូនេស៊ី", ms: "ម៉ាឡេ", tl: "ហ្វីលីពីន", vi: "វៀតណាម", th: "ថៃ", my: "ភូមា", km: "ខ្មែរ", lo: "ឡាវ" } 
    } 
  },
  lo: { 
    translation: { 
      settings: { appSettings: "ການຕັ້ງຄ່າແອັບ", general: "ທົ່ວໄປ", account: "ບັນຊີ", security: "ຄວາມປອດໄພ", notifications: "ແຈ້ງການ", subscription: "ການສະໝັກໃຊ້", support: "ການຊ່ວຍເຫຼືອ", help: "ຊ່ວຍເຫຼືອ", language: "ພາສາ", theme: "ທີມ", about: "ກ່ຽວກັບ", selectLanguage: "ເລືອກພາສາ", cancel: "ຍົກເລີກ" }, 
      languages: { en: "ອັງກິດ", id: "ອິນໂດເນເຊຍ", ms: "ມາເລ", tl: "ຟີລິບປິນ", vi: "ຫວຽດນາມ", th: "ໄທ", my: "ພະມ້າ", km: "ຂະແມ", lo: "ລາວ" } 
    } 
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;