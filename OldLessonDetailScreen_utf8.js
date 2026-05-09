import React, { useContext, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Linking 
} from 'react-native';
import { 
  ChevronLeft, Clock, CheckCircle2, Play, CheckSquare, Wallet, Home, BookOpen 
} from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

const LessonDetailScreen = ({ route, navigation }) => {
  const { lessonId = 1 } = route.params || {};
  const { lessons, markLessonDone } = useContext(LessonContext);
  const { userImage } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);
  
  const currentLessonData = lessons.find(l => l.id === lessonId) || lessons[0];
  const isCompleted = currentLessonData.status === 'done';

  const BulletItem = ({ text }) => (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>ΓÇó</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );

  const CheckItem = ({ text }) => (
    <View style={styles.bulletRow}>
      <CheckSquare color={colors.success} size={18} fill={isDarkMode ? 'rgba(56,161,105,0.2)' : '#E6FFFA'} style={{ marginRight: 8, marginTop: 2 }} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );

  const MistakeItem = ({ num, title, problem, solution }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 6}]}>Mistake #{num}: {title} Γ¥î</Text>
      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>ΓÇó</Text>
        <Text style={styles.bulletText}><Text style={{fontWeight: '700'}}>Problem:</Text> {problem}</Text>
      </View>
      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>ΓÇó</Text>
        <Text style={styles.bulletText}><Text style={{fontWeight: '700'}}>Solution:</Text> {solution}</Text>
      </View>
    </View>
  );

  const VideoPlayer = () => (
    <View style={styles.videoPlaceholder}>
      <View style={styles.playButtonWrapper}>
        <Play color={colors.text} size={32} fill={colors.text} style={{ marginLeft: 4 }} />
      </View>
    </View>
  );

  const Lesson1 = () => (
    <>
      <Text style={styles.paragraph}>Welcome to your first lesson! Let's understand why budgeting is crucial for financial success.</Text>
      <VideoPlayer />
      <Text style={styles.sectionTitle}>What is a Budget?</Text>
      <Text style={styles.paragraph}>A budget is a plan for how you'll spend your money each month. It helps you:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Track where your money goes" />
        <BulletItem text="Ensure you don't overspend" />
        <BulletItem text="Save for important goals" />
        <BulletItem text="Prepare for unexpected expenses" />
      </View>
      <Text style={styles.sectionTitle}>Why Budget?</Text>
      <Text style={styles.paragraph}>Without a budget, it's easy to lose track of spending and wonder where all your money went. With a budget:</Text>
      <View style={styles.listContainer}>
        <CheckItem text="You control your money (instead of it controlling you)" />
        <CheckItem text="You can save for the things that matter" />
        <CheckItem text="You reduce financial stress and anxiety" />
        <CheckItem text="You prepare for emergencies" />
      </View>
      <Text style={styles.sectionTitle}>The Budgeting Mindset</Text>
      <Text style={styles.paragraph}>Think of a budget not as a restriction, but as a spending plan that aligns with your values and goals.</Text>
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>"A budget is telling your money where to go instead of wondering where it went." - Dave Ramsey</Text>
      </View>
      <Text style={styles.paragraph}>In the next lesson, we'll dive into the popular 50/30/20 rule!</Text>
    </>
  );

  const Lesson2 = () => (
    <>
      <Text style={styles.paragraph}>This simple budgeting framework divides your after-tax income into three categories:</Text>
      
      <Text style={styles.sectionTitle}>50% - Needs ≡ƒÅá</Text>
      <Text style={styles.paragraph}>Essential expenses you can't avoid:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Rent/mortgage" />
        <BulletItem text="Utilities (electricity, water, internet)" />
        <BulletItem text="Groceries" />
        <BulletItem text="Transportation" />
        <BulletItem text="Insurance" />
        <BulletItem text="Minimum debt payments" />
      </View>
      <Text style={styles.paragraph}>Example: If you earn Rp 10,000,000/month after tax, allocate Rp 5,000,000 to needs.</Text>

      <Text style={styles.sectionTitle}>30% - Wants ≡ƒÄë</Text>
      <Text style={styles.paragraph}>Things that make life enjoyable but aren't essential:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Dining out" />
        <BulletItem text="Entertainment (streaming, movies)" />
        <BulletItem text="Shopping for non-essentials" />
        <BulletItem text="Hobbies & Vacations" />
      </View>
      <Text style={styles.paragraph}>Example: Allocate Rp 3,000,000 to wants.</Text>

      <Text style={styles.sectionTitle}>20% - Savings & Debt ≡ƒÆ░</Text>
      <Text style={styles.paragraph}>Building your financial future:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Emergency fund" />
        <BulletItem text="Retirement savings" />
        <BulletItem text="Investment accounts" />
        <BulletItem text="Extra debt payments (beyond minimums)" />
        <BulletItem text="Long-term goals (house, car, education)" />
      </View>
      <Text style={styles.paragraph}>Example: Save/invest Rp 2,000,000 each month.</Text>

      <Text style={[styles.sectionTitle, { color: colors.primary }]}>Customizing the Rule</Text>
      <Text style={styles.paragraph}>This is a starting point! Adjust based on your situation:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="1. Living with parents? Save more than 20%" />
        <BulletItem text="2. High rent area? Needs might be 60%" />
        <BulletItem text="3. Building emergency fund? Temporarily reduce wants to 20%" />
      </View>
      <Text style={[styles.paragraph, { fontStyle: 'italic', fontWeight: 'bold' }]}>The key is being intentional with every rupiah!</Text>
    </>
  );

  const Lesson3 = () => (
    <>
      <Text style={styles.paragraph}>Before creating a budget, you need to know where your money currently goes.</Text>
      <Text style={styles.sectionTitle}>Methods for Tracking</Text>
      
      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>1. Manual Tracking</Text>
      <Text style={styles.paragraph}>Use a notebook or spreadsheet to record every purchase for 30 days.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Free, makes you very aware of spending" />
        <BulletItem text="Cons: Time-consuming, easy to forget entries" />
      </View>
      
      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>2. Banking Apps</Text>
      <Text style={styles.paragraph}>Most banks now categorize transactions automatically.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Automatic, easy to review" />
        <BulletItem text="Cons: May not categorize correctly, doesn't include cash" />
      </View>

      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>3. Budgeting Apps</Text>
      <Text style={styles.paragraph}>Apps like Fluent combine the best of both worlds!</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Automatic + customizable, insights & recommendations" />
        <BulletItem text="Cons: May not be possible to link bank accounts" />
      </View>

      <Text style={styles.sectionTitle}>Categories to Track</Text>
      <Text style={styles.paragraph}>Organize expenses into clear categories:</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>ΓåÆ Fixed Expenses:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Rent/mortgage" />
        <BulletItem text="Insurance, Subscriptions, Loan payments" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>ΓåÆ Variable Expenses:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Groceries, Utilities" />
        <BulletItem text="Transportation, Entertainment" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>ΓåÆ Periodic Expenses:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Annual insurance payments" />
        <BulletItem text="Vehicle maintenance, Gifts, Medical expenses" />
      </View>

      <Text style={styles.sectionTitle}>The 30-Day Challenge</Text>
      <Text style={styles.paragraph}>Track every expense for 30 days. You'll be surprised by:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="1. Small purchases that add up" />
        <BulletItem text="2. Forgotten subscriptions" />
        <BulletItem text="3. Spending patterns (e.g., stress shopping)" />
      </View>
      <Text style={styles.paragraph}>At the end, you'll have the data needed to create a realistic budget!</Text>

      <View style={styles.interactiveBox}>
        <Text style={styles.interactiveBoxText}>Try this spreadsheet to track your expenses!</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://docs.google.com/spreadsheets')}>
          <Text style={styles.interactiveLink}>Monthly Expenses Tracker</Text>
        </TouchableOpacity>
        <Text style={[styles.interactiveBoxText, { marginTop: 12 }]}>or simply go to:</Text>
        <TouchableOpacity style={styles.interactiveWalletBtn} onPress={() => navigation.navigate('Wallet')}>
          <Wallet color={colors.success} size={24} />
          <Text style={styles.interactiveWalletText}>Wallet</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const Lesson4 = () => (
    <>
      <Text style={styles.paragraph}>Now that you understand the 50/30/20 rule and have tracked your expenses, let's create your budget!</Text>
      <VideoPlayer />
      
      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 1: Calculate Your Income</Text>
      <Text style={styles.paragraph}>Start with your after-tax monthly income:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Salary (after taxes, EPF, insurance)" />
        <BulletItem text="Side income" />
        <BulletItem text="Regular allowances" />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 2: List Fixed Expenses</Text>
      <Text style={styles.paragraph}>Write down all mandatory monthly payments:</Text>
      <Text style={styles.paragraph}>Housing: Rp _______</Text>
      <Text style={styles.paragraph}>Utilities: Rp _______</Text>
      <Text style={styles.paragraph}>Insurance: Rp _______</Text>
      <Text style={styles.paragraph}>Debt minimums: Rp _______</Text>
      <Text style={styles.paragraph}>Subscriptions: Rp _______</Text>
      <Text style={[styles.paragraph, { marginTop: 8 }]}>Total Needs: Rp _______</Text>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 3: Set Savings Goals</Text>
      <Text style={styles.paragraph}>Determine your 20% savings allocation:</Text>
      <Text style={styles.paragraph}>Emergency fund: Rp _______</Text>
      <Text style={styles.paragraph}>Retirement: Rp _______</Text>
      <Text style={styles.paragraph}>Short-term goals: Rp _______</Text>
      <Text style={[styles.paragraph, { marginTop: 8 }]}>Total Savings: Rp _______</Text>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 4: Allocate Wants Budget</Text>
      <Text style={styles.paragraph}>Whatever remains is for wants:{'\n'}Income - Needs - Savings = Wants Budget{'\n'}Break this down:</Text>
      <Text style={styles.paragraph}>Food & dining: Rp _______</Text>
      <Text style={styles.paragraph}>Entertainment: Rp _______</Text>
      <Text style={styles.paragraph}>Shopping: Rp _______</Text>
      <Text style={styles.paragraph}>Other: Rp _______</Text>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 5: Review & Adjust</Text>
      <Text style={styles.paragraph}>Does it add up? If not:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Identify areas to cut back" />
        <BulletItem text="Look for ways to increase income" />
        <BulletItem text="Adjust the 50/30/20 percentages temporarily" />
      </View>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 10 }]}>Remember: Your first budget won't be perfect. It takes 3-4 months to fine-tune!</Text>
    </>
  );

  const Lesson5 = () => (
    <>
      <MistakeItem num="1" title="Being Too Restrictive" problem="Cutting out all fun leads to budget burnout." solution="Include guilt-free spending money for things you enjoy. A sustainable budget beats a perfect-but-abandoned one." />
      
      <MistakeItem num="2" title="Forgetting Irregular Expenses" problem="Annual bills or periodic costs wreck your budget." solution="List all irregular expenses (insurance, gifts, car maintenance). Divide the annual total by 12 and budget that monthly. Example: Annual car insurance: Rp 3,600,000. Monthly budget amount: Rp 300,000" />
      
      <MistakeItem num="3" title="Not Tracking Cash Spending" problem="Cash withdrawals become a black hole." solution="Always note what you buy with cash, or minimize cash usage." />
      
      <MistakeItem num="4" title="Giving Up After One Bad Month" problem="One overspending incident leads to abandoning the budget." solution="Progress, not perfection! Analyze what went wrong, adjust, and keep going." />
      
      <MistakeItem num="5" title="Not Planning for Fun" problem="No budget for entertainment = no enjoyment = burnout." solution='Always include a "fun money" category. Life is about balance!' />
      
      <MistakeItem num="6" title="Setting Unrealistic Savings Goals" problem="Trying to save 50% of income when you're barely making ends meet." solution="Start small. Even saving 5-10% is progress. Increase as income grows." />
      
      <MistakeItem num="7" title="Not Reviewing Regularly" problem="Set-it-and-forget-it approach doesn't adapt to life changes." solution="Review your budget monthly. Adjust categories as needed." />
      
      <MistakeItem num="8" title="Comparing to Others" problem="Feeling bad because someone else saves more or spends less." solution="Your budget is personal. Compare to your past self, not others." />

      <Text style={[styles.sectionTitle, { color: colors.success }]}>The Fix: Build Buffer Categories</Text>
      <Text style={styles.paragraph}>Create "buffer" categories for:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Miscellaneous (unexpected small costs)" />
        <BulletItem text="Gifts" />
        <BulletItem text="Medical" />
        <BulletItem text="Home/car maintenance" />
      </View>
      <Text style={[styles.paragraph, { fontStyle: 'italic' }]}>This prevents budget blowouts when life happens!</Text>
    </>
  );

  const Lesson6 = () => (
    <>
      <Text style={styles.paragraph}>Freelancers, entrepreneurs, and commission-based workers face unique budgeting challenges. Here's how to budget when income varies!</Text>
      <VideoPlayer />
      
      <Text style={[styles.sectionTitle, { color: colors.error }]}>The Challenge</Text>
      <Text style={styles.paragraph}>Regular budgeting assumes consistent income. But what if you earn:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Rp 8,000,000 one month" />
        <BulletItem text="Rp 15,000,000 the next" />
        <BulletItem text="Rp 5,000,000 the following month?" />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Strategy 1: Use Your Lowest Income</Text>
      <Text style={styles.paragraph}>Budget based on your worst month in the past year.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Lowest month: Rp 5,000,000" />
        <BulletItem text="Budget all expenses within this amount" />
        <BulletItem text="Treat extra income as bonus to save/invest" />
        <BulletItem text="Pros: Always sustainable, builds large savings" />
        <BulletItem text="Cons: Might feel restrictive in good months" />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Strategy 2: Average Your Income</Text>
      <Text style={styles.paragraph}>Calculate average income over 6-12 months.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Total 6-month income: Rp 60,000,000" />
        <BulletItem text="Monthly average: Rp 10,000,000" />
        <BulletItem text="Budget based on Rp 10,000,000" />
        <BulletItem text="Pros: More balanced approach" />
        <BulletItem text="Cons: Requires income buffer for low months" />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Strategy 3: Zero-Based Monthly Budget</Text>
      <Text style={styles.paragraph}>Budget from scratch each month based on expected income.</Text>
      <Text style={styles.paragraph}>Steps:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="1. Estimate next month's income (conservatively)" />
        <BulletItem text="2. List expenses by priority" />
        <BulletItem text="3. Allocate every rupiah" />
        <BulletItem text="4. Stop when you hit zero" />
        <BulletItem text="Pros: Flexible, adapts quickly" />
        <BulletItem text="Cons: Requires discipline and planning" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.success }]}>Essential: Build an Income Buffer</Text>
      <Text style={styles.paragraph}>Save 3-6 months of expenses ASAP. This:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Smooths income fluctuations" />
        <BulletItem text="Reduces stress" />
        <BulletItem text="Allows strategic decisions" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.success }]}>Priority-Based Spending</Text>
      <Text style={styles.paragraph}>Rank expenses by urgency:</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>Tier 1 (Must Pay):</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Housing, Food, Utilities, Insurance" />
        <BulletItem text="Minimum debt payments" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>Tier 2 (Important):</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Savings (at least 10%)" />
        <BulletItem text="Communication (phone/internet)" />
        <BulletItem text="Transportation" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>Tier 3 (Nice to Have):</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Entertainment, Dining out" />
        <BulletItem text="Non-essential shopping" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.success }]}>Tax Considerations</Text>
      <Text style={styles.paragraph}>Set aside 20-30% of each payment for taxes immediately!</Text>

      <Text style={[styles.sectionTitle, { color: colors.success }]}>Automation is Key</Text>
      <Text style={styles.paragraph}>When income arrives:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="1. Transfer tax amount to separate account" />
        <BulletItem text="2. Pay fixed expenses" />
        <BulletItem text="3. Allocate to savings goals" />
        <BulletItem text="4. Remainder = variable expenses" />
      </View>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 10 }]}>Irregular income requires more planning, but you can achieve financial stability!</Text>
    </>
  );

  const Lesson7 = () => (
    <>
      <Text style={styles.paragraph}>Your budget should evolve with your life. Here's when and how to adjust it.</Text>
      
      <Text style={styles.sectionTitle}>When to Adjust</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}># Income Changes</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Got a raise? Increase savings before lifestyle" />
        <BulletItem text="Income decreased? Cut wants first, then adjust needs" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}># Life Events</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Moving: New rent, utilities, commute costs" />
        <BulletItem text="New family member: Diapers, food, childcare" />
        <BulletItem text="Graduation: Student loan payments begin" />
        <BulletItem text="Marriage: Combined finances need new plan" />
      </View>

      <Text style={styles.sectionTitle}>Expense Pattern Changes</Text>
      <Text style={styles.paragraph}>After 3 months, you'll notice:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Categories you consistently overspend" />
        <BulletItem text="Categories with leftover budget" />
        <BulletItem text="New expenses you forgot to include" />
      </View>

      <Text style={styles.sectionTitle}>Goal Changes</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Achieved emergency fund? Redirect to investments" />
        <BulletItem text="Planning a wedding? Create dedicated savings category" />
        <BulletItem text="Want to start a business? Budget for education/setup" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.success }]}>How to Adjust</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>1. Review Last Month</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Which categories went over? Which had surplus?" />
        <BulletItem text="Were there unexpected expenses?" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>2. Analyze Patterns</Text>
      <View style={styles.listContainer}>
        <BulletItem text='"I always go over on groceries" ΓåÆ Increase budget' />
        <BulletItem text='"I never spend full entertainment budget" ΓåÆ Decrease it' />
        <BulletItem text='"Medical costs vary wildly" ΓåÆ Create buffer' />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>3. Make Changes</Text>
      <Text style={styles.paragraph}>Adjust by moving money between categories before: Groceries Rp 2,000,000 (always over). Entertainment Rp 1,000,000 (usually under).</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>4. Test New Budget</Text>
      <Text style={styles.paragraph}>Try the adjusted budget for a month. If issues persist, adjust again.</Text>

      <Text style={styles.sectionTitle}>The 90-Day Rule</Text>
      <Text style={styles.paragraph}>Give major budget changes 90 days before judging success. It takes time to break old habits and establish new patterns.</Text>

      <Text style={styles.sectionTitle}>Percentage Adjustments for Raises</Text>
      <Text style={styles.paragraph}>When you get a raise, split it smartly. Example Rp 1,000,000 raise:{'\n'}50% to savings/investing: Rp 500,000{'\n'}30% to quality of life: Rp 300,000{'\n'}20% to goals: Rp 200,000</Text>
      
      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 20 }]}>Remember: A budget is a living document. Adjust it as often as needed to make it work for YOUR life!</Text>
    </>
  );

  const Lesson8 = () => (
    <>
      <Text style={styles.paragraph}>The right tools make budgeting easier. Let's explore your options!</Text>
      
      <Text style={styles.sectionTitle}>Digital Tools</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>Γ£ª Fluent (You're Here!) ≡ƒÄë</Text>
      <Text style={styles.paragraph}>Best for: Comprehensive financial management with AI coaching.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Features: Automatic expense tracking" />
        <BulletItem text="Budget recommendations & AI insights" />
        <BulletItem text="Goal setting and tracking" />
      </View>

      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>Γ£ª Spreadsheets (Excel, Google Sheets)</Text>
      <Text style={styles.paragraph}>Best for: People who like customization and control.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Completely free, highly customizable" />
        <BulletItem text="Cons: Manual entry, requires Excel skills" />
      </View>

      <Text style={styles.sectionTitle}>Traditional Tools</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>Γ£ª Envelope Method</Text>
      <Text style={styles.paragraph}>Best for: Cash spenders and visual learners.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Tangible, prevents overspending" />
        <BulletItem text="Cons: Only works for cash, carrying envelopes is inconvenient" />
      </View>

      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>Γ£ª Notebook/Journal</Text>
      <Text style={styles.paragraph}>Best for: People who love writing.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Mindful spending, no privacy concerns" />
        <BulletItem text="Cons: Time-consuming, no automatic calculations" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.success }]}>Choosing the Right Tool</Text>
      <Text style={styles.paragraph}>Ask yourself:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Do you prefer digital or physical?" />
        <BulletItem text="How much time can you dedicate?" />
        <BulletItem text="What's your tech comfort level?" />
        <BulletItem text="Do you want automation?" />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Pro Tip: Hybrid Approach</Text>
      <Text style={styles.paragraph}>Many successful budgeters use combinations. Example: Fluent for overall budget tracking and insights, plus Envelopes for problem categories (dining out, shopping).</Text>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 10 }]}>The best tool is the one You'll use. Don't get paralyzed choosing the "perfect" tool. Pick one and start. You can always switch later.</Text>
    </>
  );

  const renderContent = () => {
    switch(lessonId) {
      case 1: return <Lesson1 />;
      case 2: return <Lesson2 />;
      case 3: return <Lesson3 />;
      case 4: return <Lesson4 />;
      case 5: return <Lesson5 />;
      case 6: return <Lesson6 />;
      case 7: return <Lesson7 />;
      case 8: return <Lesson8 />;
      default: return <Lesson1 />;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <ChevronLeft color={colors.primary} size={20} />
            <Text style={styles.backButtonText}>Back to Lessons</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWhite}>
          
          <View style={styles.badgeRow}>
            <View style={styles.lessonBadge}><Text style={styles.lessonBadgeText}>Lesson {lessonId}</Text></View>
            <View style={styles.typeBadge}><Text style={styles.typeBadgeText}>{currentLessonData.type}</Text></View>
          </View>
          
          <Text style={styles.title}>{currentLessonData.title.split(': ')[1] || currentLessonData.title}</Text>
          
          <View style={styles.metaRow}>
            <Clock color={colors.textMuted} size={14} />
            <Text style={styles.metaTime}>{currentLessonData.duration}</Text>
            {isCompleted && (
              <>
                <CheckCircle2 color={colors.success} size={14} fill={isDarkMode ? 'rgba(56,161,105,0.2)' : '#E6FFFA'} style={{ marginLeft: 8 }} />
                <Text style={styles.metaComplete}>Completed</Text>
              </>
            )}
          </View>

          {renderContent()}

          <TouchableOpacity 
            style={[styles.completeButton, isCompleted && { backgroundColor: isDarkMode ? colors.cardAlt : '#E2E8F0' }]}
            onPress={() => markLessonDone(lessonId)}
            disabled={isCompleted}
          >
            <CheckCircle2 color={isCompleted ? colors.textMuted : colors.white} size={20} />
            <Text style={[styles.completeButtonText, isCompleted && { color: colors.textMuted }]}>
              {isCompleted ? "Completed" : "Mark as complete"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* NAVBAR */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home color="#8CA8D1" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Wallet')}>
          <Wallet color="#8CA8D1" size={24} />
          <Text style={styles.navText}>Wallet</Text>
        </TouchableOpacity>
        <View style={styles.fabWrapper}>
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Chatbot')}>
            <Image source={require('../assets/robot_navbar.png')} style={styles.fabIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Learn')}>
          <BookOpen color="#FFFFFF" size={24} />
          <Text style={styles.navTextActive}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image source={userImage ? { uri: userImage } : require('../assets/user_profile.png')} style={styles.navProfileImg} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  headerSafeArea: { paddingTop: Platform.OS === 'android' ? 40 : 10, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backButtonWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardAlt, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  backButtonText: { color: colors.primary, fontWeight: 'bold', fontSize: 13, marginLeft: 4 },
  
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  cardWhite: { backgroundColor: colors.card, borderRadius: 24, padding: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: colors.border },
  
  badgeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  lessonBadge: { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  lessonBadgeText: { color: colors.primary, fontWeight: 'bold', fontSize: 12 },
  typeBadge: { backgroundColor: colors.cardAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  typeBadgeText: { color: colors.textMuted, fontWeight: 'bold', fontSize: 12 },
  
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, lineHeight: 32 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 24 },
  metaTime: { fontSize: 13, color: colors.textMuted, marginLeft: 6 },
  metaComplete: { fontSize: 13, color: colors.success, marginLeft: 4, fontWeight: '500' },
  
  paragraph: { fontSize: 15, color: colors.text, lineHeight: 22, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 12 },
  
  videoPlaceholder: { width: '100%', height: 200, backgroundColor: colors.cardAlt, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginVertical: 20, borderWidth: 1, borderColor: colors.border },
  playButtonWrapper: { width: 64, height: 64, backgroundColor: colors.card, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 },
  
  listContainer: { marginBottom: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, paddingRight: 10 },
  bulletDot: { fontSize: 18, color: colors.text, marginRight: 10, lineHeight: 22, fontWeight: 'bold' },
  bulletText: { fontSize: 15, color: colors.text, lineHeight: 24, flex: 1 },
  
  quoteBox: { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.1)' : '#EBF4FF', borderLeftWidth: 4, borderLeftColor: colors.primary, padding: 16, borderRadius: 8, marginVertical: 20 },
  quoteText: { fontSize: 15, color: colors.textMuted, fontStyle: 'italic', lineHeight: 24 },
  
  interactiveBox: { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.1)' : '#E6FFFA', borderLeftWidth: 4, borderLeftColor: colors.success, padding: 20, borderRadius: 12, marginVertical: 20, alignItems: 'center' },
  interactiveBoxText: { fontSize: 14, color: colors.success, textAlign: 'center', lineHeight: 22 },
  interactiveLink: { fontSize: 14, color: colors.success, textDecorationLine: 'underline', fontWeight: 'bold', marginTop: 8 },
  interactiveWalletBtn: { alignItems: 'center', marginTop: 12 },
  interactiveWalletText: { color: colors.success, fontWeight: 'bold', marginTop: 4 },

  completeButton: { backgroundColor: colors.success, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, marginTop: 30, gap: 10 },
  completeButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '600' },
  navTextActive: { color: colors.navIconActive, fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: colors.navBg },
  fabIcon: { width: 44, height: 44 }
});

export default LessonDetailScreen;
