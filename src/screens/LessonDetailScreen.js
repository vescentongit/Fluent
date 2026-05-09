import React, { useContext, useMemo, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Linking, Modal
} from 'react-native';
import { 
  ChevronLeft, Clock, CheckCircle2, Play, CheckSquare, Wallet, Home, BookOpen, X
} from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

const LessonDetailScreen = ({ route, navigation }) => {
  const { lessonId = 1, courseId = 'budgeting101' } = route.params || {};
  const { markLessonDone, courses } = useContext(LessonContext);
  const { userImage, formatCurrency, currencySymbol } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);
  
  const course = courses[courseId];
  const lessons = course?.lessons || [];
  const currentLessonData = lessons.find(l => l.id === lessonId) || lessons[0] || {};
  const isCompleted = currentLessonData.status === 'done';

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handlePlayVideo = (url) => {
    if (url) {
      setVideoUrl(url);
      setShowVideoModal(true);
    }
  };

  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match && match[1];
  };

  const BulletItem = ({ text }) => (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
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
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 6}]}>Mistake #{num}: {title} ❌</Text>
      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}><Text style={{fontWeight: '700'}}>Problem:</Text> {problem}</Text>
      </View>
      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}><Text style={{fontWeight: '700'}}>Solution:</Text> {solution}</Text>
      </View>
    </View>
  );

  const VideoPlayer = ({ url }) => {
    if (!url) return null;

    return (
      <TouchableOpacity
        style={styles.videoPlayerContainer}
        onPress={() => handlePlayVideo(url)}
        activeOpacity={0.8}
      >
        <View style={styles.videoThumbnail}>
          <Image
            source={{ uri: `https://img.youtube.com/vi/${getYouTubeVideoId(url)}/maxresdefault.jpg` }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Play color="#FFFFFF" size={24} fill="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>
        <Text style={styles.videoDuration}>{currentLessonData.duration || 'Watch Video'}</Text>
      </TouchableOpacity>
    );
  };

  const Lesson1 = () => (
    <>
      <Text style={styles.paragraph}>Welcome to your first lesson! Let's understand why budgeting is crucial for financial success.</Text>
      <VideoPlayer url={currentLessonData.videoUrl} />
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
      
      <Text style={styles.sectionTitle}>50% - Needs 🏠</Text>
      <Text style={styles.paragraph}>Essential expenses you can't avoid:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Rent/mortgage" />
        <BulletItem text="Utilities (electricity, water, internet)" />
        <BulletItem text="Groceries" />
        <BulletItem text="Transportation" />
        <BulletItem text="Insurance" />
        <BulletItem text="Minimum debt payments" />
      </View>
      <Text style={styles.paragraph}>Example: If you earn {formatCurrency(10000000)}/month after tax, allocate {formatCurrency(5000000)} to needs.</Text>

      <Text style={styles.sectionTitle}>30% - Wants 🎉</Text>
      <Text style={styles.paragraph}>Things that make life enjoyable but aren't essential:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Dining out" />
        <BulletItem text="Entertainment (streaming, movies)" />
        <BulletItem text="Shopping for non-essentials" />
        <BulletItem text="Hobbies & Vacations" />
      </View>
      <Text style={styles.paragraph}>Example: Allocate {formatCurrency(3000000)} to wants.</Text>

      <Text style={styles.sectionTitle}>20% - Savings & Debt 💰</Text>
      <Text style={styles.paragraph}>Building your financial future:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Emergency fund" />
        <BulletItem text="Retirement savings" />
        <BulletItem text="Investment accounts" />
        <BulletItem text="Extra debt payments (beyond minimums)" />
        <BulletItem text="Long-term goals (house, car, education)" />
      </View>
      <Text style={styles.paragraph}>Example: Save/invest {formatCurrency(2000000)} each month.</Text>

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
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>→ Fixed Expenses:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Rent/mortgage" />
        <BulletItem text="Insurance, Subscriptions, Loan payments" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>→ Variable Expenses:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Groceries, Utilities" />
        <BulletItem text="Transportation, Entertainment" />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>→ Periodic Expenses:</Text>
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
      <VideoPlayer url={currentLessonData.videoUrl} />
      
      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 1: Calculate Your Income</Text>
      <Text style={styles.paragraph}>Start with your after-tax monthly income:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Salary (after taxes, EPF, insurance)" />
        <BulletItem text="Side income" />
        <BulletItem text="Regular allowances" />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 2: List Fixed Expenses</Text>
      <Text style={styles.paragraph}>Write down all mandatory monthly payments:</Text>
      <Text style={styles.paragraph}>Housing: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Utilities: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Insurance: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Debt minimums: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Subscriptions: {currencySymbol} _______</Text>
      <Text style={[styles.paragraph, { marginTop: 8 }]}>Total Needs: {currencySymbol} _______</Text>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 3: Set Savings Goals</Text>
      <Text style={styles.paragraph}>Determine your 20% savings allocation:</Text>
      <Text style={styles.paragraph}>Emergency fund: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Retirement: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Short-term goals: {currencySymbol} _______</Text>
      <Text style={[styles.paragraph, { marginTop: 8 }]}>Total Savings: {currencySymbol} _______</Text>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Step 4: Allocate Wants Budget</Text>
      <Text style={styles.paragraph}>Whatever remains is for wants:{'\n'}Income - Needs - Savings = Wants Budget{'\n'}Break this down:</Text>
      <Text style={styles.paragraph}>Food & dining: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Entertainment: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Shopping: {currencySymbol} _______</Text>
      <Text style={styles.paragraph}>Other: {currencySymbol} _______</Text>

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
            <MistakeItem num="2" title="Forgetting Irregular Expenses" problem="Annual bills or periodic costs wreck your budget." solution={`List all irregular expenses (insurance, gifts, car maintenance). Divide the annual total by 12 and budget that monthly. Example: Annual car insurance: ${formatCurrency(3600000)} Monthly budget amount: ${formatCurrency(300000)}`} />
      
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
      <VideoPlayer url={currentLessonData.videoUrl} />
      
      <Text style={[styles.sectionTitle, { color: colors.error }]}>The Challenge</Text>
      <Text style={styles.paragraph}>Regular budgeting assumes consistent income. But what if you earn:</Text>
      <View style={styles.listContainer}>
        <BulletItem text={`${formatCurrency(8000000)} one month`} />
        <BulletItem text={`${formatCurrency(15000000)} the next`} />
        <BulletItem text={`${formatCurrency(5000000)} the following month?`} />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Strategy 1: Use Your Lowest Income</Text>
      <Text style={styles.paragraph}>Budget based on your worst month in the past year.</Text>
      <View style={styles.listContainer}>
        <BulletItem text={`Lowest month: ${formatCurrency(5000000)}`} />
        <BulletItem text="Budget all expenses within this amount" />
        <BulletItem text="Treat extra income as bonus to save/invest" />
        <BulletItem text="Pros: Always sustainable, builds large savings" />
        <BulletItem text="Cons: Might feel restrictive in good months" />
      </View>

      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Strategy 2: Average Your Income</Text>
      <Text style={styles.paragraph}>Calculate average income over 6-12 months.</Text>
      <View style={styles.listContainer}>
        <BulletItem text={`Total 6-month income: ${formatCurrency(60000000)}`} />
        <BulletItem text={`Monthly average: ${formatCurrency(10000000)}`} />
        <BulletItem text={`Budget based on ${formatCurrency(10000000)}`} />
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
        <BulletItem text='"I always go over on groceries" → Increase budget' />
        <BulletItem text='"I never spend full entertainment budget" → Decrease it' />
        <BulletItem text='"Medical costs vary wildly" → Create buffer' />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>3. Make Changes</Text>
      <Text style={styles.paragraph}>Adjust by moving money between categories before: Groceries {formatCurrency(2000000)} (always over). Entertainment {formatCurrency(1000000)} (usually under).</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>4. Test New Budget</Text>
      <Text style={styles.paragraph}>Try the adjusted budget for a month. If issues persist, adjust again.</Text>

      <Text style={styles.sectionTitle}>The 90-Day Rule</Text>
      <Text style={styles.paragraph}>Give major budget changes 90 days before judging success. It takes time to break old habits and establish new patterns.</Text>

      <Text style={styles.sectionTitle}>Percentage Adjustments for Raises</Text>
      <Text style={styles.paragraph}>When you get a raise, split it smartly. Example {formatCurrency(1000000)} raise:{'\n'}50% to savings/investing: {formatCurrency(500000)}{'\n'}30% to quality of life: {formatCurrency(300000)}{'\n'}20% to goals: {formatCurrency(200000)}</Text>
      
      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 20 }]}>Remember: A budget is a living document. Adjust it as often as needed to make it work for YOUR life!</Text>
    </>
  );

  const Lesson8 = () => (
    <>
      <Text style={styles.paragraph}>The right tools make budgeting easier. Let's explore your options!</Text>
      
      <Text style={styles.sectionTitle}>Digital Tools</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>✦ Fluent (You're Here!) 🎉</Text>
      <Text style={styles.paragraph}>Best for: Comprehensive financial management with AI coaching.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Features: Automatic expense tracking" />
        <BulletItem text="Budget recommendations & AI insights" />
        <BulletItem text="Goal setting and tracking" />
      </View>

      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>✦ Spreadsheets (Excel, Google Sheets)</Text>
      <Text style={styles.paragraph}>Best for: People who like customization and control.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Completely free, highly customizable" />
        <BulletItem text="Cons: Manual entry, requires Excel skills" />
      </View>

      <Text style={styles.sectionTitle}>Traditional Tools</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>✦ Envelope Method</Text>
      <Text style={styles.paragraph}>Best for: Cash spenders and visual learners.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Tangible, prevents overspending" />
        <BulletItem text="Cons: Only works for cash, carrying envelopes is inconvenient" />
      </View>

      <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>✦ Notebook/Journal</Text>
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

  const InvestingLesson1 = () => (
    <>
      <Text style={styles.paragraph}>Saving money is great, but investing can help your money grow faster. Let's understand why!</Text>
      <VideoPlayer url={currentLessonData.videoUrl} />
      
      <Text style={styles.sectionTitle}>The Problem with Just Saving</Text>
      <Text style={styles.paragraph}>Imagine you save {formatCurrency(10000000)} in a regular savings account earning 1% interest per year.</Text>
      <Text style={styles.paragraph}>After 1 year: {formatCurrency(10100000)} (gained {formatCurrency(100000)}){'\n'}But if inflation is 3% per year, you actually lost purchasing power!</Text>
      <Text style={styles.paragraph}>What cost {formatCurrency(10000000)} last year now costs {formatCurrency(10300000)} Your money grew by {formatCurrency(100000)} but prices grew by {formatCurrency(300000)}</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Real return: -2% (You can buy less than before!)" />
      </View>

      <Text style={styles.sectionTitle}>The Power of Investing</Text>
      <Text style={styles.paragraph}>Now imagine investing that {formatCurrency(10000000)} with an average 8% annual return (typical for diversified investments).</Text>
      <Text style={styles.paragraph}>After 1 year: {formatCurrency(10800000)} (gained {formatCurrency(800000)}){'\n'}Even with 3% inflation, your purchasing power grew by 5%!</Text>

      <Text style={styles.sectionTitle}>Compound Growth: The 8th Wonder</Text>
      <Text style={styles.paragraph}>Here's where it gets exciting. With compound growth, you earn returns on your returns.</Text>
      <Text style={styles.paragraph}>{formatCurrency(10000000)} at 8% annual return:</Text>
      <View style={styles.listContainer}>
        <BulletItem text={`Year 1: ${formatCurrency(10800000)}`} />
        <BulletItem text={`Year 5: ${formatCurrency(14693280)}`} />
        <BulletItem text={`Year 10: ${formatCurrency(21589250)}`} />
        <BulletItem text={`Year 20: ${formatCurrency(46609571)}`} />
        <BulletItem text={`Year 30: ${formatCurrency(100626568)}`} />
      </View>
      <Text style={styles.paragraph}>That's over 10x growth in 30 years without adding a single rupiah!</Text>

      <Text style={styles.sectionTitle}>Starting Early Matters</Text>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}># Scenario A: Start at 25</Text>
      <Text style={styles.paragraph}>Invest {formatCurrency(500000)}/month for 10 years (age 25-35){'\n'}Stop investing at 35, let it grow{'\n'}Total invested: {formatCurrency(60000000)}{'\n'}Value at 65 (assuming 8% return): {formatCurrency(791000000)}</Text>
      
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}># Scenario B: Start at 35</Text>
      <Text style={styles.paragraph}>Invest {formatCurrency(500000)}/month for 30 years (age 35-65){'\n'}Total invested: {formatCurrency(180000000)}{'\n'}Value at 65: {formatCurrency(678000000)}</Text>
      
      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 8 }]}>Starting 10 years earlier wins, despite investing 1/3 as much! ⏰</Text>

      <Text style={styles.sectionTitle}>Investment Goals</Text>
      <Text style={styles.paragraph}>Common reasons to invest:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Retirement: Stop working someday" />
        <BulletItem text="Home purchase: Down payment for property" />
        <BulletItem text="Children's education: University fees" />
        <BulletItem text="Financial independence: Live off investment income" />
        <BulletItem text="Wealth building: Generational wealth" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.success }]}>Key Principles</Text>
      <Text style={styles.paragraph}>1. Time in the market beats timing the market. Stay invested long-term. Don't try to predict highs and lows.</Text>
      <Text style={styles.paragraph}>2. Start small, start now. Even {formatCurrency(100000)}/month matters. Waiting costs more than investing small.</Text>
      <Text style={styles.paragraph}>3. Diversification reduces risk. Don't put all eggs in one basket. Spread across different investments.</Text>
      <Text style={styles.paragraph}>4. Invest what you can afford to lose. Never invest emergency fund. Only invest money you won't need for 5+ years.</Text>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 16 }]}>Ready to start building wealth? Let's learn how! 🚀</Text>
    </>
  );

  const InvestingLesson2 = () => (
    <>
      <Text style={styles.paragraph}>Let's break down the main types of investments you'll encounter.</Text>
      
      <Text style={styles.sectionTitle}>1. Stocks (Saham) 📈</Text>
      <Text style={styles.paragraph}>When you buy a stock, you're buying a tiny piece of ownership in a company.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you make money: The stock price goes up, or the company pays you dividends (a share of profits)." />
        <BulletItem text="Example: Buying shares of Bank Central Asia (BBCA) or Telkom Indonesia (TLKM). If the business grows, your share value grows!" />
        <BulletItem text="Risk: High" />
        <BulletItem text="Pros: Highest potential returns." />
        <BulletItem text="Cons: Prices go up and down daily; you could lose money if the company does poorly." />
        <BulletItem text="Best for: Long-term goals (5+ years)." />
      </View>

      <Text style={styles.sectionTitle}>2. Bonds (Obligasi) 🏛️</Text>
      <Text style={styles.paragraph}>When you buy a bond, you're lending money to a company or the government.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you make money: They pay you regular interest, and return your original money at the end." />
        <BulletItem text="Example: Buying Indonesian Government Bonds (SBN/ORI). You get a guaranteed return every month/year." />
        <BulletItem text="Risk: Low to Medium" />
        <BulletItem text="Pros: Fixed, predictable income; safer than stocks." />
        <BulletItem text="Cons: Lower returns than stocks." />
        <BulletItem text="Best for: Medium-term goals (1-5 years), conservative investors." />
      </View>

      <Text style={styles.sectionTitle}>3. Mutual Funds (Reksa Dana) 🧺</Text>
      <Text style={styles.paragraph}>A mutual fund pools money from many investors to buy a mix of stocks, bonds, or other assets. It's managed by a professional.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you make money: The value of the pool goes up, or they pay dividends." />
      </View>
      <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>Types:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pasar Uang (Money Market): Low risk, like a better savings account." />
        <BulletItem text="Pendapatan Tetap (Fixed Income): Low-to-Medium risk, mostly bonds." />
        <BulletItem text="Campuran (Balanced): Medium risk, mix of stocks & bonds." />
        <BulletItem text="Saham (Equity): High risk, mostly stocks." />
      </View>
      <View style={styles.listContainer}>
        <BulletItem text="Risk: Varies (Low to High depending on the type)" />
        <BulletItem text="Pros: Instant diversification (you don't put all eggs in one basket); managed by pros." />
        <BulletItem text="Cons: Management fees (though usually low)." />
        <BulletItem text="Best for: Beginners who want to invest easily." />
      </View>

      <Text style={styles.sectionTitle}>4. Gold (Emas) 🥇</Text>
      <Text style={styles.paragraph}>Physical gold or digital gold savings.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you make money: Sell it when the price goes up." />
        <BulletItem text="Risk: Low to Medium" />
        <BulletItem text="Pros: Good hedge against inflation; safe haven during economic crisis." />
        <BulletItem text="Cons: Doesn't produce income (no dividends/interest); storing physical gold has risks." />
        <BulletItem text="Best for: Wealth preservation, long-term safety." />
      </View>

      <Text style={styles.sectionTitle}>5. Real Estate (Properti) 🏠</Text>
      <Text style={styles.paragraph}>Investing in land, houses, or commercial properties.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you make money: Renting it out (passive income) or selling it for a profit." />
        <BulletItem text="Risk: Medium to High" />
        <BulletItem text="Pros: Tangible asset; provides cash flow (rent)." />
        <BulletItem text="Cons: Requires large capital to start; highly illiquid (hard to sell quickly)." />
        <BulletItem text="Best for: Long-term wealth generation, experienced investors." />
      </View>

      <Text style={styles.sectionTitle}>6. Cryptocurrency (Kripto) ₿</Text>
      <Text style={styles.paragraph}>Digital currencies like Bitcoin or Ethereum.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you make money: Sell it for more than you bought it." />
        <BulletItem text="Risk: Extremely High" />
        <BulletItem text="Pros: Massive potential returns; decentralized." />
        <BulletItem text="Cons: Highly volatile (prices swing wildly); unregulated in some aspects." />
        <BulletItem text="Best for: Small percentage of your portfolio, high-risk tolerance." />
      </View>

      <View style={[styles.interactiveBox, { borderLeftColor: colors.warning, backgroundColor: isDarkMode ? 'rgba(221,107,32,0.1)' : '#FFFBF0' }]}>
        <Text style={[styles.interactiveBoxText, { color: colors.warning, fontWeight: 'bold', fontSize: 16 }]}>Which one should you choose?</Text>
        <Text style={[styles.interactiveBoxText, { color: colors.text, marginTop: 8 }]}>Your ideal mix depends on your:</Text>
        <View style={{ width: '100%', alignItems: 'flex-start', marginTop: 4 }}>
            <BulletItem text="Age: Younger investors can typically take more risk." />
            <BulletItem text="Goals: What are you saving for?" />
            <BulletItem text="Risk Tolerance: Can you sleep at night if your investment drops 20%?" />
        </View>
        <Text style={[styles.interactiveBoxText, { color: colors.text, marginTop: 12 }]}>A common beginner strategy in Indonesia is:</Text>
        <View style={{ width: '100%', alignItems: 'flex-start', marginTop: 4 }}>
            <BulletItem text="Start with Reksa Dana Pasar Uang for your emergency fund." />
            <BulletItem text="Move to Reksa Dana Saham or SBN for long-term goals." />
        </View>
      </View>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 10 }]}>In the next lesson, we'll dive deeper into Risk and Return! 🚀</Text>
    </>
  );

  const InvestingLesson3 = () => (
    <>
      <Text style={styles.sectionTitle}>Core Concepts: What are Return and Risk?</Text>
      <Text style={styles.paragraph}>In every financial decision, there are always two sides of the coin: the potential for profit and the potential for loss.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Return: The profit earned from an investment. Returns usually come in two forms:" />
        <View style={{ paddingLeft: 16 }}>
            <BulletItem text="Capital Gain: An increase in the price of an asset (e.g., buying a stock at $10 and selling it at $15)." />
            <BulletItem text="Yield/Cash Flow: Regular passive income received from the asset (e.g., stock dividends, bond coupons, or rental income)." />
        </View>
        <BulletItem text="Risk: The degree of uncertainty that the actual return will differ from the expected return. Simply put: what are the chances of losing your money? Risk is often measured by volatility (how sharply prices rise and fall over a short period)." />
      </View>

      <Text style={styles.sectionTitle}>The Golden Rule: High Risk, High Return</Text>
      <Text style={styles.paragraph}>This is the universal law of investing. To achieve higher potential returns, an investor must be willing to accept a higher level of risk.</Text>
      <Text style={styles.paragraph}>Here is a general spectrum of assets, from lowest to highest risk:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Bank Deposits: Near-zero risk (often government-insured), but very low returns (often beaten by inflation)." />
        <BulletItem text="Money Market Funds / Government Bonds: Low risk, with returns slightly better than standard deposits." />
        <BulletItem text="Blue-Chip Stocks: Moderate to high risk, but the potential returns can comfortably outpace inflation." />
        <BulletItem text="Tech/Small-Cap Stocks & Crypto: Very high risk (prices can drop significantly in a single day), but with the potential for exponential returns (multibaggers)." />
      </View>

      <Text style={styles.sectionTitle}>Why Does Your Risk Profile Matter?</Text>
      <Text style={styles.paragraph}>Everyone has a different tolerance for uncertainty. Knowing your risk profile helps you choose the right investment instruments so you can still sleep peacefully at night.</Text>
      <Text style={styles.paragraph}>Generally, risk profiles are divided into three categories:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Conservative: Highly averse to losing money. Prefers to keep the principal safe, even if the returns are minimal. (Ideal: Deposits, Government Bonds)." />
        <BulletItem text="Moderate: Willing to accept some short-term volatility in exchange for decent asset growth over the medium to long term. (Ideal: Balanced Mutual Funds, Corporate Bonds)." />
        <BulletItem text="Aggressive: Understands that the market can drop sharply, but is willing to take that risk to multiply wealth in the future. (Ideal: Stocks, Peer-to-Peer Lending)." />
      </View>

      <Text style={styles.sectionTitle}>Strategy: Diversification</Text>
      <Text style={[styles.paragraph, { fontStyle: 'italic', marginBottom: 4 }]}>"Don't put all your eggs in one basket."</Text>
      <Text style={[styles.paragraph, { marginBottom: 12 }]}>-Miguel de Cervantes</Text>
      <Text style={styles.paragraph}>If you put all your money into one stock and that company goes bankrupt, you lose everything. Diversification is the strategy of spreading your portfolio across various asset classes, sectors, or instruments. The primary goal is not to maximize returns, but to minimize risk. If your tech stocks are down, your banking stocks might be up, neutralizing the overall loss.</Text>
    </>
  );

  const InvestingLesson4 = () => (
    <>
      <VideoPlayer url={currentLessonData.videoUrl} />
      <Text style={styles.sectionTitle}>Core Concept: What is a Reksadana?</Text>
      <Text style={styles.paragraph}>Think of Reksadana (Mutual Funds) as a 'financial pooling pool' inside an investment. Inside it, your money is pooled with money from many other investors. This large pool is then managed by a professional "Money Manager" (Manajer Investasi), whose job is to spread the money across various financial instruments like deposits, bonds, and stocks.</Text>
      <Text style={styles.paragraph}>Reksadana is heavily regulated and supervised by the Financial Services Authority (OJK), ensuring safety for investors.</Text>

      <Text style={styles.sectionTitle}>The Mechanics: Understanding NAV and Subscription/Redemption</Text>
      <View style={styles.listContainer}>
        <BulletItem text={`NAV (Net Asset Value): Think of NAV as the 'price per slice' of the Reksadana pie. When you invest, you are essentially buying slices (units) of this pie. (e.g., if you invest ${formatCurrency(1000000)} and the NAV is ${formatCurrency(1000)} per unit, you get 1,000 units). As the underlying assets (stocks, bonds, etc.) increase in value, the NAV increases. You make a profit when you sell your units at a higher NAV than when you bought them.`} />
        <BulletItem text="Subscription and Redemption: You don't buy or sell Reksadana directly on the stock market. Instead, you subscribe (buy) units directly from the Money Manager (or their agents) and redeem (sell) them back to them. This provides liquidity and ensures you can access your funds when needed." />
      </View>

      <Text style={styles.sectionTitle}>Why is Reksadana Ideal for Beginners?</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Professional Management: You don't need to analyze individual stocks or bonds. Experienced fund managers handle the research, selection, and daily monitoring of the assets." />
        <BulletItem text={`Instant Diversification: Even with a small amount of money (e.g., ${formatCurrency(100000)}), your investment is instantly spread across various instruments, reducing risk compared to buying a single stock.`} />
        <BulletItem text={`Accessibility: You can start with as little as ${formatCurrency(10000)} (around $0.65). It's highly affordable and allows you to build the habit of investing early.`} />
        <BulletItem text="High Liquidity: While not as liquid as a standard savings account, you can typically redeem your units and have the cash in your bank account within a few working days." />
      </View>

      <Text style={styles.sectionTitle}>Four Main Types of Reksadana</Text>
      <View style={styles.listContainer}>
        <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4}]}>1. Reksadana Pasar Uang (Money Market Fund):</Text>
        <View style={{ paddingLeft: 16 }}>
            <BulletItem text="What it invests in: Short-term debt instruments (under 1 year) like time deposits and short-term bonds." />
            <BulletItem text="Risk/Return Profile: Very low risk, lowest return. It's essentially a slightly better savings account, ideal for emergency funds or very short-term goals." />
        </View>

        <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4, marginTop: 8}]}>2. Reksadana Pendapatan Tetap (Fixed Income Fund):</Text>
        <View style={{ paddingLeft: 16 }}>
            <BulletItem text="What it invests in: At least 80% in bonds (government or corporate)." />
            <BulletItem text="Risk/Return Profile: Low to medium risk. Offers a steady, predictable return, generally beating inflation. Ideal for medium-term goals (1-3 years)." />
        </View>

        <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4, marginTop: 8}]}>3. Reksadana Campuran (Balanced Fund):</Text>
        <View style={{ paddingLeft: 16 }}>
            <BulletItem text="What it invests in: A mix of stocks, bonds, and money market instruments. The manager adjusts the mix based on market conditions." />
            <BulletItem text="Risk/Return Profile: Medium risk, medium return. A good middle ground, balancing growth potential with some stability. Ideal for goals 3-5 years away." />
        </View>

        <Text style={[styles.paragraph, {fontWeight: 'bold', marginBottom: 4, marginTop: 8}]}>4. Reksadana Saham (Equity Fund):</Text>
        <View style={{ paddingLeft: 16 }}>
            <BulletItem text="What it invests in: At least 80% in stocks." />
            <BulletItem text="Risk/Return Profile: Highest risk, highest potential return. Highly volatile in the short term, but historically provides the best growth over the long term. Ideal for long-term wealth building, like retirement (5+ years)." />
        </View>
      </View>

      <Text style={styles.sectionTitle}>How to start investing in Reksadana:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Choose a Platform: Download an APERD (Agen Penjual Efek Reksa Dana) app like Bibit, Bareksa, or Ajaib." />
        <BulletItem text="Complete KYC: Verify your identity using your KTP." />
        <BulletItem text="Assess Your Risk Profile: The app will likely ask you some questions to determine if you are conservative, moderate, or aggressive." />
        <BulletItem text="Pick a Fund and Invest: Based on your risk profile and goals, select a Reksadana type and make your first deposit. You can even set up auto-debit for consistent investing." />
      </View>
    </>
  );

  const InvestingLesson5 = () => (
    <>
      <Text style={styles.sectionTitle}>The Core Concept: What is a Stock?</Text>
      <Text style={styles.paragraph}>When you buy a stock, you are not just trading a digital ticker symbol. You are buying a tiny, actual slice of ownership in a real business.</Text>
      <Text style={styles.paragraph}>If you buy shares in a major bank or a consumer goods company, you legally own a fraction of that company. If the company grows, opens new branches, and makes larger profits, the inherent value of your slice grows along with it. Conversely, if the company loses money or faces bankruptcy, the value of your ownership shrinks.</Text>

      <Text style={styles.sectionTitle}>How the Stock Market Works</Text>
      <Text style={styles.paragraph}>Think of the stock market as a massive, highly regulated digital supermarket. Instead of groceries, the products being bought and sold are shares of public companies.</Text>
      <Text style={styles.paragraph}>The price of any stock at any given second is driven entirely by the law of supply and demand:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="When Demand is High: If a company announces record-breaking profits, more investors will want to buy its stock. When buyers outnumber sellers, they have to bid higher prices to get the shares, driving the stock price up." />
        <BulletItem text="When Supply is High: If a company faces a scandal or a bad economic outlook, investors will rush to sell their shares. To find buyers, they must lower their asking price, driving the stock price down." />
      </View>
    </>
  );

  const renderContent = () => {
    if (courseId === 'investingBasics') {
      switch(lessonId) {
        case 1: return <InvestingLesson1 />;
        case 2: return <InvestingLesson2 />;
        case 3: return <InvestingLesson3 />;
        case 4: return <InvestingLesson4 />;
        case 5: return <InvestingLesson5 />;
        default: return <Text style={styles.paragraph}>Coming Soon!</Text>;
      }
    } else {
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
            onPress={() => markLessonDone(courseId, lessonId)}
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

      {/* YouTube Video Modal */}
      <Modal
        visible={showVideoModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.videoModalContainer}>
          <View style={styles.videoModalHeader}>
            <TouchableOpacity
              style={styles.closeVideoBtn}
              onPress={() => setShowVideoModal(false)}
            >
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.videoModalTitle}>{currentLessonData.title?.split(': ')[1] || currentLessonData.title}</Text>
            <View style={styles.videoModalSpacer} />
          </View>
          <View style={styles.videoPlayerWrapper}>
            <TouchableOpacity
              style={styles.openInBrowserBtn}
              onPress={() => Linking.openURL(videoUrl)}
            >
              <Play color="#FFFFFF" size={20} />
              <Text style={styles.openInBrowserText}>Watch on YouTube</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // YouTube Video Player Styles
  videoPlayerContainer: { width: '100%', backgroundColor: colors.cardAlt, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: colors.border, paddingBottom: 12 },
  videoThumbnail: { width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden', position: 'relative' },
  thumbnailImage: { width: '100%', height: '100%' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  playButton: { width: 56, height: 56, backgroundColor: 'rgba(255,0,0,0.9)', borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  videoDuration: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 12, fontWeight: '600' },

  // Video Modal Styles
  videoModalContainer: { flex: 1, backgroundColor: '#000000' },
  videoModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'android' ? 50 : 30 },
  closeVideoBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  videoModalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: 16 },
  videoModalSpacer: { width: 40 },
  videoPlayerWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  openInBrowserBtn: { backgroundColor: '#FF0000', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, paddingHorizontal: 32, gap: 12, width: '100%' },
  openInBrowserText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

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
