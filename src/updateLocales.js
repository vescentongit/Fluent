const fs = require('fs');
const path = require('path');

const localesDir = path.join('c:', 'Fluent', 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const newKeys = {
  home: {
    goodMorning: "Good Morning 👋",
    lvl: "Lvl",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    expenseRecorded: "Expense Recorded",
    atStarbucks: "at Starbucks",
    minsAgo: "2 mins ago",
    systemUpdate: "System Update",
    quickPrompt1: 'Evaluate my spending\nthis month',
    quickPrompt2: 'Help me use the\n50/30/20 rule',
    quickPrompt3: 'How do I start investing\nas a beginner?',
    quickPrompt4: "What's the difference between\nregular saving and investing?",
    quickPrompt5: "Tips to pay off Paylater\nso it doesn't pile up",
    promptsToday: 'Prompts today:',
    inputPlaceholder: 'Ask your AI assistant anything...',
    aiSmarter: "Fluent AI is now smarter!",
    hourAgo: "1 hour ago",
    totalBalance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    yourGoals: "Your Goals",
    complete: "complete",
    daysLeft: "days left",
    completed: "Completed!",
    noActiveGoals: "No Active Goals",
    tapSetGoal: 'Tap "Set Goal" to create your first financial goal!',
    viewAllGoals: "View All Goals",
    fluentsAdvice: "Fluent's Advice",
    resilienceScore: "Resilience Score",
    xpProgress: "XP Progress",
    toLevel: "xp to level",
    maxLevel: "Max level reached!",
    aiInsight: "AI Insight",
    coffeeSpending: "Your coffee spending this week ",
    rose15: "rose 15%",
    tryBringingLunch: ". Try bringing lunch from home to save more!",
    quickActions: "Quick Actions",
    setGoal: "Set Goal",
    aiAdvice: "AI Advice",
    upgradeElite: "Upgrade to Fluent Elite",
    bookSession: "Book a 1-on-1 Session",
    getAdvice: "Get personalized advice from a financial advisor",
    weeklySpending: "Weekly Spending",
    thisWeek: "This week",
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
    myDebts: "My Debts",
    myAssets: "My Assets",
    totalDebtsValue: "Total Debts Value",
    totalAssetsValue: "Total Assets Value",
    debt: "Debt",
    asset: "Asset",
    newItemName: "New Item Name",
    amount: "Amount"
  },
  wallet: {
    title: "Wallet",
    transactions: "Transactions",
    income: "Income",
    expenses: "Expenses",
    searchPlaceholder: "Search transactions....",
    all: "All",
    expense: "Expense",
    addTransaction: "Add Transaction",
    titleInput: "Title",
    titlePlaceholder: "E.g. Lunch/Salary",
    amount: "Amount",
    chooseIcon: "Choose Icon",
    saveIncome: "Save Income",
    saveExpense: "Save Expense"
  },
  learn: {
    title: "Learn & Level Up",
    subtitle: "Earn XP, unlock badges!",
    currentStreak: "Current Streak",
    days: "Days",
    streakBonus: "Keep it up! +50 XP streak bonus",
    dailyChallenges: "Daily Challenges",
    finish1Lesson: "Finish 1 lesson in any courses",
    get80Quiz: "Get 80% in any quizzes",
    finish3Lessons: "Finish 3 lessons in any courses",
    courses: "Courses",
    budgeting101: "Budgeting 101",
    budgetingDesc: "Master the 50/30/20 rule and take control of your finances",
    lessons: "lessons",
    progress: "Progress",
    investingBasics: "Investing Basics",
    investingDesc: "Stocks, bonds, Reksa Dana. Start building wealth today",
    emergencyFund: "Emergency Fund Guide",
    emergencyDesc: "Build your financial safety net in 90 days",
    passiveIncome: "Passive Income",
    passiveDesc: "7 proven strategies to earn while you sleep",
    reachLevel4: "Reach Level 4 to unlock!"
  },
  profile: {
    title: "Profile",
    level: "LV.",
    maxLevel: "Max Level",
    xpToNextLevel: "XP to next level",
    maxLevelReached: "Max level reached!",
    resilienceScore: "Resilience Score",
    goodStanding: "Good Standing!",
    months: "months",
    totalBalance: "Total Balance",
    monthlySpending: "Monthly Spending",
    debtRatio: "Debt Ratio",
    insight1: "Dining spending increased 21% this week",
    insight2: "Paying",
    insight2b: "more toward debt could reduce payoff by 3 months",
    insight3: "Savings rate improved by 6%",
    bookSession: "Book a 1-on-1 Session",
    getAdvice: "Get personalized advice from a financial advisor",
    currentStreak: "Current Streak",
    days: "Days",
    badges: "Badges",
    goalsTargets: "Goals & Targets",
    appSettings: "App Settings"
  },
  badges: {
    lv1Title: "Level 1 Badge",
    lv1Name: "Financial Trailblazer",
    lv1Desc: "The first step toward a bright future! You've taken the leap to begin your financial journey. This proves your commitment to learning, tracking your expenses, and taking charge of your money.",
    lv1Status: "Unlocked Sunday, August 17, 2025",
    lv2Title: "Level 2 Badge",
    lv2Name: "Savvy Manager",
    lv2Desc: "A solid foundation is taking shape! You've mastered the art of basic budgeting and can easily spot the difference between needs and wants. Keep up these smart money habits!",
    lv2Status: "Unlocked Thursday, October 19, 2025",
    "30DaysTitle": "30 Days Streak Badge",
    "30DaysName": "Consistency Champion",
    "30DaysDesc": "Incredible! For 30 consecutive days, you've shown up for your finances without fail. A powerful new habit has officially taken root in your life. Keep this momentum going!",
    "30DaysStatus": "Unlocked Sunday, December 21, 2025",
    lv3Title: "Level 3 Badge",
    lv3Name: "Strategic Planner",
    lv3Desc: "You are now fully in the driver's seat of your finances. You understand the power of an emergency fund and have started strategizing to protect your future from financial surprises.",
    lv3Status: "Unlocked Monday, February 2, 2026",
    lv4Title: "Level 4 Badge",
    lv4Name: "Wealth Architect",
    lv4Desc: "Reach level 4 to unlock this badge!",
    "100DaysTitle": "100 Days Streak Badge",
    "100DaysName": "Discipline Centurion",
    "100DaysDesc": "Log your expenses for 100 consecutive days to unlock!",
    lv5Title: "Level 5 Badge",
    lv5Name: "Financial Maestro",
    lv5Desc: "Reach level 5 to unlock this badge!"
  },
  nav: {
    home: "Home",
    wallet: "Wallet",
    learn: "Learn",
    profile: "Profile"
  }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  for (const ns in newKeys) {
    if (!data[ns]) {
      data[ns] = {};
    }
    for (const key in newKeys[ns]) {
      if (!data[ns][key]) {
        data[ns][key] = newKeys[ns][key];
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});
console.log('Successfully updated locales');
