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
  const { courseId = 'investingBasics', lessonId = 1 } = route.params || {};
  const { courses, markLessonDone } = useContext(LessonContext);
  const { userImage } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const course = courses[courseId] || courses['investingBasics'];
  const courseColor = course.themeColor || colors.primary;
  const styles = useMemo(() => createStyles(colors, isDarkMode, courseColor), [colors, isDarkMode, courseColor]);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const currentLessonData = course.lessons.find(l => l.id === lessonId) || course.lessons[0];
  const isCompleted = currentLessonData.status === 'done';

  const handlePlayVideo = () => {
    if (currentLessonData.type === 'video' && currentLessonData.videoUrl) {
      setVideoUrl(currentLessonData.videoUrl);
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
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 6 }]}>Mistake #{num}: {title} ❌</Text>
      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}><Text style={{ fontWeight: '700' }}>Problem:</Text> {problem}</Text>
      </View>
      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}><Text style={{ fontWeight: '700' }}>Solution:</Text> {solution}</Text>
      </View>
    </View>
  );

  const VideoPlayer = () => {
    if (currentLessonData.type === 'video' && currentLessonData.videoUrl) {
      return (
        <TouchableOpacity
          style={styles.videoPlayerContainer}
          onPress={handlePlayVideo}
          activeOpacity={0.8}
        >
          <View style={styles.videoThumbnail}>
            <Image
              source={{ uri: `https://img.youtube.com/vi/${getYouTubeVideoId(currentLessonData.videoUrl)}/maxresdefault.jpg` }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
            <View style={styles.playOverlay}>
              <View style={styles.playButton}>
                <Play color="#FFFFFF" size={24} fill="#FFFFFF" />
              </View>
            </View>
          </View>
          <Text style={styles.videoDuration}>{currentLessonData.duration}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.videoPlaceholder}>
        <View style={styles.playButtonWrapper}>
          <Play color={colors.text} size={32} fill={colors.text} style={{ marginLeft: 4 }} />
        </View>
      </View>
    );
  };

  const BudgetingLesson1 = () => (
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

  const BudgetingLesson2 = () => (
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

  const BudgetingLesson3 = () => (
    <>
      <Text style={styles.paragraph}>Before creating a budget, you need to know where your money currently goes.</Text>
      <Text style={styles.sectionTitle}>Methods for Tracking</Text>

      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>1. Manual Tracking</Text>
      <Text style={styles.paragraph}>Use a notebook or spreadsheet to record every purchase for 30 days.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Free, makes you very aware of spending" />
        <BulletItem text="Cons: Time-consuming, easy to forget entries" />
      </View>

      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>2. Banking Apps</Text>
      <Text style={styles.paragraph}>Most banks now categorize transactions automatically.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Automatic, easy to review" />
        <BulletItem text="Cons: May not categorize correctly, doesn't include cash" />
      </View>

      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>3. Budgeting Apps</Text>
      <Text style={styles.paragraph}>Apps like Fluent combine the best of both worlds!</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Automatic + customizable, insights & recommendations" />
        <BulletItem text="Cons: May not be possible to link bank accounts" />
      </View>

      <Text style={styles.sectionTitle}>Categories to Track</Text>
      <Text style={styles.paragraph}>Organize expenses into clear categories:</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>ΓåÆ Fixed Expenses:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Rent/mortgage" />
        <BulletItem text="Insurance, Subscriptions, Loan payments" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>ΓåÆ Variable Expenses:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Groceries, Utilities" />
        <BulletItem text="Transportation, Entertainment" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>ΓåÆ Periodic Expenses:</Text>
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

  const BudgetingLesson4 = () => (
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

  const BudgetingLesson5 = () => (
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

  const BudgetingLesson6 = () => (
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
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Tier 1 (Must Pay):</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Housing, Food, Utilities, Insurance" />
        <BulletItem text="Minimum debt payments" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Tier 2 (Important):</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Savings (at least 10%)" />
        <BulletItem text="Communication (phone/internet)" />
        <BulletItem text="Transportation" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Tier 3 (Nice to Have):</Text>
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

  const BudgetingLesson7 = () => (
    <>
      <Text style={styles.paragraph}>Your budget should evolve with your life. Here's when and how to adjust it.</Text>

      <Text style={styles.sectionTitle}>When to Adjust</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}># Income Changes</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Got a raise? Increase savings before lifestyle" />
        <BulletItem text="Income decreased? Cut wants first, then adjust needs" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}># Life Events</Text>
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
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>1. Review Last Month</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Which categories went over? Which had surplus?" />
        <BulletItem text="Were there unexpected expenses?" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>2. Analyze Patterns</Text>
      <View style={styles.listContainer}>
        <BulletItem text='"I always go over on groceries" ΓåÆ Increase budget' />
        <BulletItem text='"I never spend full entertainment budget" ΓåÆ Decrease it' />
        <BulletItem text='"Medical costs vary wildly" ΓåÆ Create buffer' />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>3. Make Changes</Text>
      <Text style={styles.paragraph}>Adjust by moving money between categories before: Groceries Rp 2,000,000 (always over). Entertainment Rp 1,000,000 (usually under).</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>4. Test New Budget</Text>
      <Text style={styles.paragraph}>Try the adjusted budget for a month. If issues persist, adjust again.</Text>

      <Text style={styles.sectionTitle}>The 90-Day Rule</Text>
      <Text style={styles.paragraph}>Give major budget changes 90 days before judging success. It takes time to break old habits and establish new patterns.</Text>

      <Text style={styles.sectionTitle}>Percentage Adjustments for Raises</Text>
      <Text style={styles.paragraph}>When you get a raise, split it smartly. Example Rp 1,000,000 raise:{'\n'}50% to savings/investing: Rp 500,000{'\n'}30% to quality of life: Rp 300,000{'\n'}20% to goals: Rp 200,000</Text>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 20 }]}>Remember: A budget is a living document. Adjust it as often as needed to make it work for YOUR life!</Text>
    </>
  );

  const BudgetingLesson8 = () => (
    <>
      <Text style={styles.paragraph}>The right tools make budgeting easier. Let's explore your options!</Text>

      <Text style={styles.sectionTitle}>Digital Tools</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Γ£ª Fluent (You're Here!) ≡ƒÄë</Text>
      <Text style={styles.paragraph}>Best for: Comprehensive financial management with AI coaching.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Features: Automatic expense tracking" />
        <BulletItem text="Budget recommendations & AI insights" />
        <BulletItem text="Goal setting and tracking" />
      </View>

      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Γ£ª Spreadsheets (Excel, Google Sheets)</Text>
      <Text style={styles.paragraph}>Best for: People who like customization and control.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Completely free, highly customizable" />
        <BulletItem text="Cons: Manual entry, requires Excel skills" />
      </View>

      <Text style={styles.sectionTitle}>Traditional Tools</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Γ£ª Envelope Method</Text>
      <Text style={styles.paragraph}>Best for: Cash spenders and visual learners.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Tangible, prevents overspending" />
        <BulletItem text="Cons: Only works for cash, carrying envelopes is inconvenient" />
      </View>

      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Γ£ª Notebook/Journal</Text>
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
      <VideoPlayer />

      <Text style={styles.sectionTitle}>The Problem with Just Saving</Text>
      <Text style={styles.paragraph}>Imagine you save Rp 10,000,000 in a regular savings account earning 1% interest per year.</Text>
      <Text style={styles.paragraph}>After 1 year: Rp 10,100,000 (gained Rp 100,000){'\n'}But if inflation is 3% per year, you actually lost purchasing power!</Text>
      <Text style={styles.paragraph}>What cost Rp 10,000,000 last year now costs Rp 10,300,000. Your money grew by Rp 100,000 but prices grew by Rp 300,000.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Real return: -2% (You can buy less than before!)" />
      </View>

      <Text style={styles.sectionTitle}>The Power of Investing</Text>
      <Text style={styles.paragraph}>Now imagine investing that Rp 10,000,000 with an average 8% annual return (typical for diversified investments).</Text>
      <Text style={styles.paragraph}>After 1 year: Rp 10,800,000 (gained Rp 800,000){'\n'}Even with 3% inflation, your purchasing power grew by 5%!</Text>

      <Text style={styles.sectionTitle}>Compound Growth: The 8th Wonder</Text>
      <Text style={styles.paragraph}>Here's where it gets exciting. With compound growth, you earn returns on your returns.</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Rp 10,000,000 at 8% annual return:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Year 1: Rp 10,800,000" />
        <BulletItem text="Year 5: Rp 14,693,280" />
        <BulletItem text="Year 10: Rp 21,589,250" />
        <BulletItem text="Year 20: Rp 46,609,571" />
        <BulletItem text="Year 30: Rp 100,626,568" />
      </View>
      <Text style={styles.paragraph}>That's over 10x growth in 30 years without adding a single rupiah!</Text>

      <Text style={styles.sectionTitle}>Starting Early Matters</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}># Scenario A: Start at 25</Text>
      <Text style={styles.paragraph}>Invest Rp 500,000/month for 10 years (age 25-35){'\n'}Stop investing at 35, let it grow{'\n'}Total invested: Rp 60,000,000{'\n'}Value at 65 (assuming 8% return): Rp 791,000,000</Text>

      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}># Scenario B: Start at 35</Text>
      <Text style={styles.paragraph}>Invest Rp 500,000/month for 30 years (age 35-65){'\n'}Total invested: Rp 180,000,000{'\n'}Value at 65: Rp 678,000,000</Text>

      <Text style={[styles.paragraph, { fontWeight: 'bold', color: colors.primary }]}>Starting 10 years earlier wins, despite investing 1/3 as much! ⏰</Text>

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
      <View style={styles.listContainer}>
        <BulletItem text="1. Time in the market beats timing the market. Stay invested long-term. Don't try to predict highs and lows." />
        <BulletItem text="2. Start small, start now. Even Rp 100,000/month matters. Waiting costs more than investing small." />
        <BulletItem text="3. Diversification reduces risk. Don't put all eggs in one basket. Spread across different investments." />
        <BulletItem text="4. Invest what you can afford to lose. Never invest emergency fund. Only invest money you won't need for 5+ years." />
      </View>

      <Text style={[styles.paragraph, { fontStyle: 'italic', fontWeight: 'bold' }]}>Ready to start building wealth? Let's learn how! 🚀</Text>
    </>
  );

  const InvestingLesson2 = () => (
    <>
      <Text style={styles.paragraph}>Let's break down the main types of investments available to you.</Text>

      <Text style={styles.sectionTitle}>1. Stocks (Saham) 📈</Text>
      <Text style={styles.paragraph}>Owning a piece (share) of a company. If the company does well, you do well.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you gain: Price goes up, Dividends" />
        <BulletItem text="Indonesian context: Available on IDX (Bursa Efek Indonesia)" />
      </View>
      <Text style={[styles.paragraph, { fontStyle: 'italic' }]}>Example: You buy 100 shares of Bank BCA (BBCA). If BBCA profits grow, your shares will likely rise in price, and you get a cut of profits (dividends).</Text>
      <View style={styles.listContainer}>
        <CheckItem text="Pros: High potential returns, Ownership in real businesses, Dividend income, Easy to buy/sell (liquid) on trading apps" />
        <BulletItem text="Cons: Volatile (prices go up and down a lot), Requires research, Risk of losing money, Emotional rollercoaster" />
      </View>

      <Text style={styles.sectionTitle}>2. Bonds (Obligasi) 🏛️</Text>
      <Text style={styles.paragraph}>You are lending money to the government or a corporation.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you gain: Fixed interest payments (coupon), Return of principal at maturity" />
        <BulletItem text="Indonesian context: SBN (Surat Berharga Negara), ORI, Sukuk" />
      </View>
      <Text style={[styles.paragraph, { fontStyle: 'italic' }]}>Example: You buy Rp 1,000,000 of SBN. The government pays you 6% interest (Rp 60,000) every year for 3 years. Then they return your Rp 1,000,000.</Text>
      <View style={styles.listContainer}>
        <CheckItem text="Pros: Fixed, predictable returns, Lower risk than stocks, SBN is guaranteed by the state, Good for medium-term goals" />
        <BulletItem text="Cons: Lower returns than stocks, Money is locked up until maturity, Inflation can erode real return" />
      </View>

      <Text style={styles.sectionTitle}>3. Mutual Funds (Reksadana) 📊</Text>
      <Text style={styles.paragraph}>Pooling money with other investors, managed by a professional.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you gain: Price goes up (NAV/NAB)" />
        <BulletItem text="Indonesian context: Very popular, easy to start via apps like Bibit or Bareksa." />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Types:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Money Market (Pasar Uang): Low risk, low return. Good for emergency funds." />
        <BulletItem text="Fixed Income (Pendapatan Tetap): Medium risk, medium return." />
        <BulletItem text="Balanced (Campuran): Medium-high risk, mixed stocks and bonds." />
        <BulletItem text="Equity (Saham): High risk, high return." />
      </View>
      <Text style={[styles.paragraph, { fontStyle: 'italic' }]}>Example: You don't know which stocks to pick. You buy Reksadana Saham, and the fund manager buys top 30 Indonesian companies for you.</Text>
      <View style={styles.listContainer}>
        <CheckItem text="Pros: Professionally managed, Instantly diversified, Start with very small amounts (Rp 10k), Easy for beginners" />
        <BulletItem text="Cons: Management fees (Expense ratio), You don't control the individual stocks, Returns might underperform the market" />
      </View>

      <Text style={styles.sectionTitle}>4. Gold (Emas) 🥇</Text>
      <Text style={styles.paragraph}>Physical or digital gold holdings.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you gain: Price goes up over time" />
        <BulletItem text="Indonesian context: Antam, Pegadaian, Digital apps (Pluang, Treasury)" />
      </View>
      <Text style={[styles.paragraph, { fontStyle: 'italic' }]}>Example: You buy 5g of Antam gold to protect against inflation.</Text>
      <View style={styles.listContainer}>
        <CheckItem text="Pros: Hedge against inflation, Tangible asset (if physical), Universal value, Highly liquid" />
        <BulletItem text="Cons: No passive income (no yield), Storage costs (if physical), Price can be stagnant for years" />
      </View>

      <Text style={styles.sectionTitle}>5. Real Estate (Properti) 🏠</Text>
      <Text style={styles.paragraph}>Owning physical land or buildings.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you gain: Rental income, Property value appreciation" />
      </View>
      <Text style={[styles.paragraph, { fontStyle: 'italic' }]}>Example: You buy a small house, rent it out for Rp 20,000,000/year, and hope the house value goes up.</Text>
      <View style={styles.listContainer}>
        <CheckItem text="Pros: Tangible asset, Passive income, Tax advantages (sometimes)" />
        <BulletItem text="Cons: Requires large capital, Illiquid (hard to sell quickly), Maintenance costs, Bad tenants can be a headache" />
      </View>

      <Text style={styles.sectionTitle}>6. Cryptocurrency (Kripto) ₿</Text>
      <Text style={styles.paragraph}>Digital tokens secured by blockchain (Bitcoin, Ethereum, etc.).</Text>
      <View style={styles.listContainer}>
        <BulletItem text="How you gain: Price goes up" />
        <BulletItem text="Indonesian context: Legal as a commodity. Regulated by Bappebti. Available on Tokocrypto, Indodax, Pintu." />
      </View>
      <View style={styles.listContainer}>
        <CheckItem text="Pros: Very high potential returns, Decentralized, 24/7 trading, Innovative technology" />
        <BulletItem text="Cons: Extremely volatile, Regulatory uncertainty, Risk of scams or hacks, Not backed by physical assets" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.danger, marginTop: 10 }]}>Summary: Which to pick?</Text>
      <Text style={styles.paragraph}>Your choice depends on your goals:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Short-term (< 1 year): Money market Reksadana" />
        <BulletItem text="Medium-term (1-5 years): Bonds, Fixed income Reksadana" />
        <BulletItem text="Long-term (> 5 years): Stocks, Equity Reksadana, Real estate" />
      </View>

      <Text style={[styles.paragraph, { fontStyle: 'italic', fontWeight: 'bold' }]}>Ready to dive deeper into risk? Let's go to the next lesson! 👉</Text>
    </>
  );

  const InvestingLesson3 = () => (
    <>
      <Text style={styles.paragraph}>In every financial decision, there are always two sides of the coin: the potential for profit and the potential for loss.</Text>

      <Text style={styles.sectionTitle}>Core Concepts: What are Return and Risk?</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Return: The profit earned from an investment." />
      </View>
      <Text style={styles.paragraph}>Returns usually come in two forms:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Capital Gain: An increase in the price of an asset (e.g., buying a stock at $10 and selling it at $15)." />
        <BulletItem text="Yield/Cash Flow: Regular passive income received from the asset (e.g., stock dividends, bond coupons, or rental income)." />
      </View>
      <View style={styles.listContainer}>
        <BulletItem text="Risk: The degree of uncertainty that the actual return will differ from the expected return. Simply put: what are the chances of losing your money? Risk is often measured by volatility (how sharply prices rise and fall over a short period)." />
      </View>

      <Text style={styles.sectionTitle}>The Golden Rule: High Risk, High Return</Text>
      <Text style={styles.paragraph}>This is the universal law of investing. To achieve higher potential returns, an investor must be willing to accept a higher level of risk.</Text>
      <Text style={styles.paragraph}>Here is a general spectrum of assets, from lowest to highest risk:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="1. Bank Deposits: Near-zero risk (often government-insured), but very low returns (often beaten by inflation)." />
        <BulletItem text="2. Money Market Funds / Government Bonds: Low risk, with returns slightly better than standard deposits." />
        <BulletItem text="3. Blue-Chip Stocks: Moderate to high risk, but the potential returns can comfortably outpace inflation." />
        <BulletItem text="4. Tech/Small-Cap Stocks & Crypto: Very high risk (prices can drop significantly in a single day), but with the potential for exponential returns (multibaggers)." />
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
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>"Don't put all your eggs in one basket." - Miguel de Cervantes</Text>
      </View>
      <Text style={styles.paragraph}>If you put all your money into one stock and that company goes bankrupt, you lose everything. Diversification is the strategy of spreading your portfolio across various asset classes, sectors, or instruments. The primary goal is not to maximize returns, but to minimize risk. If your tech stocks are down, your banking stocks might be up, neutralizing the overall loss.</Text>
    </>
  );

  const InvestingLesson4 = () => (
    <>
      <VideoPlayer />

      <Text style={styles.sectionTitle}>The Core Concept: What is Reksadana?</Text>
      <Text style={styles.paragraph}>Think of Reksadana (Mutual Funds) as a 'financial ride-sharing' service. Instead of buying individual stocks or bonds—which requires a large amount of capital and deep market research—you pool your money together with thousands of other investors.</Text>
      <Text style={styles.paragraph}>This massive pool of funds is then handed over to a licensed professional, known as a Fund Manager (Manajer Investasi). The Fund Manager uses this money to buy a well-researched, diversified portfolio of stocks, bonds, or money market instruments, acting on behalf of all the investors in the pool.</Text>

      <Text style={styles.sectionTitle}>The Mechanics: Understanding NAV and Subscription</Text>
      <Text style={styles.paragraph}>When you invest in a mutual fund, you aren't buying "shares" of a company; you are buying "Units of Participation" (Unit Penyertaan). The price of one unit is called the NAV (Net Asset Value) or NAB (Nilai Aktiva Bersih).</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Subscription (Pembelian): When you invest money, the fund manager calculates how many units you get based on the current NAV. For example, if you invest Rp 1,000,000 and the NAV is Rp 1,000/unit, you will receive 1,000 units." />
        <BulletItem text="Redemption (Penjualan Kembali): When you want to withdraw your money, you sell your units back to the fund manager. If the NAV has increased to Rp 1,200/unit since you bought it, your 1,000 units are now worth Rp 1,200,000. That Rp 200,000 difference is your profit." />
      </View>

      <Text style={styles.sectionTitle}>Why is it the Ultimate Starter Pack?</Text>
      <Text style={styles.paragraph}>For beginners entering the Indonesian capital market, mutual funds are highly recommended:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Professional Management: You don't need to stare at charts or read financial reports. The fund manager does the heavy lifting, analyzing market trends, company performance, and economic indicators to decide exactly what to buy and sell." />
        <BulletItem text="Instant Diversification: Even with a modest investment of Rp 100,000, your money is spread out across dozens of different assets. This significantly lowers your risk compared to buying a single stock." />
        <BulletItem text="High Liquidity & Easy Access: You can start investing via apps like Bibit or Bareksa with just a few taps. And when you need your money back, you can sell your units and withdraw your funds on any working day." />
        <BulletItem text="Affordable: In the past, investing required substantial capital. Today, mutual funds are highly democratized, with minimum investments as low as Rp 10,000." />
      </View>

      <Text style={styles.sectionTitle}>The 4 Main Types of Mutual Funds</Text>
      <Text style={styles.paragraph}>Mutual funds are categorized based on where the fund manager invests your money. This directly correlates to the level of risk and potential return:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="1. Money Market (Pasar Uang)" />
        <View style={{ paddingLeft: 16 }}>
          <Text style={styles.bulletText}>- Where it invests: Highly liquid, short-term debt instruments like bank deposits and SBI (Sertifikat Bank Indonesia).</Text>
          <Text style={styles.bulletText}>- Profile: Lowest risk, lowest potential return (usually around 4-5% per year). Ideal for emergency funds or parking cash for less than a year.</Text>
        </View>
        <BulletItem text="2. Fixed Income (Pendapatan Tetap)" />
        <View style={{ paddingLeft: 16 }}>
          <Text style={styles.bulletText}>- Where it invests: At least 80% in bonds (debt securities) issued by the government or corporations.</Text>
          <Text style={styles.bulletText}>- Profile: Moderate risk. Better returns than money market (around 5-8% per year), but bond prices can fluctuate slightly. Good for medium-term goals (1-3 years).</Text>
        </View>
        <BulletItem text="3. Balanced (Campuran)" />
        <View style={{ paddingLeft: 16 }}>
          <Text style={styles.bulletText}>- Where it invests: A flexible mix of stocks, bonds, and money market instruments. The fund manager actively shifts the allocation based on market conditions.</Text>
          <Text style={styles.bulletText}>- Profile: Moderate to high risk. Offers a balance of growth potential (from stocks) and stability (from bonds). Good for a 3-5 year horizon.</Text>
        </View>
        <BulletItem text="4. Equity (Saham)" />
        <View style={{ paddingLeft: 16 }}>
          <Text style={styles.bulletText}>- Where it invests: At least 80% in stocks.</Text>
          <Text style={styles.bulletText}>- Profile: Highest risk, with the highest potential return. Very volatile in the short term, but historically provides the best growth over the long term. Ideal for wealth building goals that are 5+ years away, like retirement.</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>How to Take Your First Step</Text>
      <Text style={styles.paragraph}>Getting started is easier than ever:</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pick a Platform: Download an investment app (like Bibit or Bareksa). You will need your KTP and a bank account to register." />
        <BulletItem text="Define Your Goal & Profile: Are you saving for a vacation next year (short-term, low risk) or retirement in 20 years (long-term, high risk)?" />
        <BulletItem text="Choose & Automate: Select a mutual fund that aligns with your goal. Set up an automatic monthly transfer (auto-debit) to consistently build your wealth." />
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
        <BulletItem text="When Demand is High: If a company announces record breaking profits, more investors will want to buy its stock. When buyers outnumber sellers, they have to bid higher prices to get the shares, driving the stock price up." />
        <BulletItem text="When Supply is High: If a company faces a scandal or a bad economic outlook, investors will rush to sell their shares. To find buyers, they must lower their asking price, driving the stock price down." />
      </View>
    </>
  );

  const InvestingLesson6 = () => (
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
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Tier 1 (Must Pay):</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Housing, Food, Utilities, Insurance" />
        <BulletItem text="Minimum debt payments" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Tier 2 (Important):</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Savings (at least 10%)" />
        <BulletItem text="Communication (phone/internet)" />
        <BulletItem text="Transportation" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Tier 3 (Nice to Have):</Text>
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

  const InvestingLesson7 = () => (
    <>
      <Text style={styles.paragraph}>Your budget should evolve with your life. Here's when and how to adjust it.</Text>

      <Text style={styles.sectionTitle}>When to Adjust</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}># Income Changes</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Got a raise? Increase savings before lifestyle" />
        <BulletItem text="Income decreased? Cut wants first, then adjust needs" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}># Life Events</Text>
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
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>1. Review Last Month</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Which categories went over? Which had surplus?" />
        <BulletItem text="Were there unexpected expenses?" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>2. Analyze Patterns</Text>
      <View style={styles.listContainer}>
        <BulletItem text='"I always go over on groceries" → Increase budget' />
        <BulletItem text='"I never spend full entertainment budget" → Decrease it' />
        <BulletItem text='"Medical costs vary wildly" → Create buffer' />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>3. Make Changes</Text>
      <Text style={styles.paragraph}>Adjust by moving money between categories before: Groceries Rp 2,000,000 (always over). Entertainment Rp 1,000,000 (usually under).</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>4. Test New Budget</Text>
      <Text style={styles.paragraph}>Try the adjusted budget for a month. If issues persist, adjust again.</Text>

      <Text style={styles.sectionTitle}>The 90-Day Rule</Text>
      <Text style={styles.paragraph}>Give major budget changes 90 days before judging success. It takes time to break old habits and establish new patterns.</Text>

      <Text style={styles.sectionTitle}>Percentage Adjustments for Raises</Text>
      <Text style={styles.paragraph}>When you get a raise, split it smartly. Example Rp 1,000,000 raise:{'\n'}50% to savings/investing: Rp 500,000{'\n'}30% to quality of life: Rp 300,000{'\n'}20% to goals: Rp 200,000</Text>

      <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 20 }]}>Remember: A budget is a living document. Adjust it as often as needed to make it work for YOUR life!</Text>
    </>
  );

  const InvestingLesson8 = () => (
    <>
      <Text style={styles.paragraph}>The right tools make budgeting easier. Let's explore your options!</Text>

      <Text style={styles.sectionTitle}>Digital Tools</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>✦ Fluent (You're Here!) 🎉</Text>
      <Text style={styles.paragraph}>Best for: Comprehensive financial management with AI coaching.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Features: Automatic expense tracking" />
        <BulletItem text="Budget recommendations & AI insights" />
        <BulletItem text="Goal setting and tracking" />
      </View>

      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>✦ Spreadsheets (Excel, Google Sheets)</Text>
      <Text style={styles.paragraph}>Best for: People who like customization and control.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Completely free, highly customizable" />
        <BulletItem text="Cons: Manual entry, requires Excel skills" />
      </View>

      <Text style={styles.sectionTitle}>Traditional Tools</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>✦ Envelope Method</Text>
      <Text style={styles.paragraph}>Best for: Cash spenders and visual learners.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pros: Tangible, prevents overspending" />
        <BulletItem text="Cons: Only works for cash, carrying envelopes is inconvenient" />
      </View>

      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>✦ Notebook/Journal</Text>
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

  const EmergencyLesson1 = () => (
    <>
      <Text style={styles.paragraph}>An emergency fund is a dedicated stash of money used only for unexpected and urgent needs.</Text>
      <VideoPlayer />
      <Text style={styles.sectionTitle}>Why It Matters</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Protects you from high-interest debt" />
        <BulletItem text="Gives you breathing room during tough times" />
        <BulletItem text="Keeps long-term goals and investments safe" />
      </View>
      <Text style={styles.sectionTitle}>What It Is Not For</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Impulse shopping or flash sales" />
        <BulletItem text="Luxury upgrades" />
        <BulletItem text="Non-urgent lifestyle wants" />
      </View>
    </>
  );

  const EmergencyLesson2 = () => (
    <>
      <Text style={styles.sectionTitle}>How Much Should You Save?</Text>
      <Text style={styles.paragraph}>A practical benchmark is 3-6 months of essential expenses.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Start with mini target: 1 month expense" />
        <BulletItem text="Then move to 3 months baseline" />
        <BulletItem text="Aim 6 months if income is unstable" />
      </View>
      <Text style={styles.sectionTitle}>Quick Formula</Text>
      <Text style={styles.paragraph}>Emergency Fund Target = Monthly Essentials x Number of Months</Text>
      <Text style={styles.paragraph}>If essentials are Rp 4,000,000, then 3 months target is Rp 12,000,000.</Text>
    </>
  );

  const EmergencyLesson3 = () => (
    <>
      <Text style={styles.sectionTitle}>Where to Keep It</Text>
      <Text style={styles.paragraph}>Emergency funds must be safe, stable, and easy to access quickly.</Text>
      <View style={styles.listContainer}>
        <CheckItem text="High-liquidity savings account" />
        <CheckItem text="Money market fund for low volatility" />
        <CheckItem text="Separate account from daily spending" />
      </View>
      <Text style={styles.sectionTitle}>Avoid</Text>
      <View style={styles.listContainer}>
        <BulletItem text="High-risk assets (crypto, speculative stocks)" />
        <BulletItem text="Locked instruments with penalties" />
        <BulletItem text="Mixing with spending wallet" />
      </View>
    </>
  );

  const EmergencyLesson4 = () => (
    <>
      <Text style={styles.sectionTitle}>The 90-Day Build Plan</Text>
      <Text style={styles.paragraph}>Use a short sprint to build momentum and consistency.</Text>
      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Month 1: Audit & Stop the Leaks</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Track every transaction for 4 weeks" />
        <BulletItem text="Cancel wasteful subscriptions" />
        <BulletItem text="Set a fixed weekly savings transfer" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Month 2: Automate</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Auto-transfer right after payday" />
        <BulletItem text="Redirect extra income to emergency fund" />
      </View>
      <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Month 3: Lock Habit</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Review and optimize categories" />
        <BulletItem text="Increase transfer amount by 10-15%" />
      </View>
    </>
  );

  const EmergencyLesson5 = () => (
    <>
      <Text style={styles.paragraph}>Not every surprise is an emergency. Use this filter before withdrawing.</Text>
      <VideoPlayer />
      <Text style={styles.sectionTitle}>The 3-Question Test</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Is it unexpected?" />
        <BulletItem text="Is it necessary?" />
        <BulletItem text="Is it urgent?" />
      </View>
      <Text style={styles.paragraph}>If one answer is "No", reconsider other funding options first.</Text>
    </>
  );

  const EmergencyLesson6 = () => (
    <>
      <Text style={styles.sectionTitle}>Rebuilding After Use</Text>
      <Text style={styles.paragraph}>Using emergency funds is not failure. The system worked. Now rebuild quickly.</Text>
      <View style={styles.listContainer}>
        <BulletItem text="Pause non-essential investing temporarily" />
        <BulletItem text="Set a 3-6 month replenishment goal" />
        <BulletItem text="Increase temporary saving rate" />
      </View>
      <Text style={styles.sectionTitle}>Replenishment Formula</Text>
      <Text style={styles.paragraph}>Needed amount / target months = monthly top-up.</Text>
      <Text style={styles.paragraph}>Example: Rp 6,000,000 / 6 months = Rp 1,000,000 per month.</Text>
    </>
  );


  const renderContent = () => {
    if (courseId === 'budgeting101') {
      switch (lessonId) {
        case 1: return <BudgetingLesson1 />;
        case 2: return <BudgetingLesson2 />;
        case 3: return <BudgetingLesson3 />;
        case 4: return <BudgetingLesson4 />;
        case 5: return <BudgetingLesson5 />;
        case 6: return <BudgetingLesson6 />;
        case 7: return <BudgetingLesson7 />;
        case 8: return <BudgetingLesson8 />;
        default: return <BudgetingLesson1 />;
      }
    }

    if (courseId === 'emergencyFundGuide') {
      switch (lessonId) {
        case 1: return <EmergencyLesson1 />;
        case 2: return <EmergencyLesson2 />;
        case 3: return <EmergencyLesson3 />;
        case 4: return <EmergencyLesson4 />;
        case 5: return <EmergencyLesson5 />;
        case 6: return <EmergencyLesson6 />;
        default: return <EmergencyLesson1 />;
      }
    }

    {
      switch (lessonId) {
        case 1: return <InvestingLesson1 />;
        case 2: return <InvestingLesson2 />;
        case 3: return <InvestingLesson3 />;
        case 4: return <InvestingLesson4 />;
        case 5: return <InvestingLesson5 />;
        default: return <InvestingLesson1 />;
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <ChevronLeft color={courseColor} size={20} />
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
            onPress={() => {
              markLessonDone(courseId, lessonId);
              navigation.goBack();
            }}
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
            <Text style={styles.videoModalTitle}>{currentLessonData.title}</Text>
            <View style={styles.videoModalSpacer} />
          </View>
          <View style={styles.videoPlayerWrapper}>
            <TouchableOpacity
              style={styles.openInBrowserBtn}
              onPress={() => Linking.openURL(currentLessonData.videoUrl)}
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

const createStyles = (colors, isDarkMode, courseColor) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  headerSafeArea: { paddingTop: Platform.OS === 'android' ? 40 : 10, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backButtonWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardAlt, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  backButtonText: { color: courseColor, fontWeight: 'bold', fontSize: 13, marginLeft: 4 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  cardWhite: { backgroundColor: colors.card, borderRadius: 24, padding: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: colors.border },

  badgeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  lessonBadge: { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  lessonBadgeText: { color: courseColor, fontWeight: 'bold', fontSize: 12 },
  typeBadge: { backgroundColor: colors.cardAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  typeBadgeText: { color: colors.textMuted, fontWeight: 'bold', fontSize: 12 },

  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, lineHeight: 32 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 24 },
  metaTime: { fontSize: 13, color: colors.textMuted, marginLeft: 6 },
  metaComplete: { fontSize: 13, color: colors.success, marginLeft: 4, fontWeight: '500' },

  paragraph: { fontSize: 15, color: colors.text, lineHeight: 22, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 12 },

  videoPlaceholder: { width: '100%', height: 200, backgroundColor: colors.cardAlt, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginVertical: 20, borderWidth: 1, borderColor: colors.border },
  playButtonWrapper: { width: 64, height: 64, backgroundColor: colors.card, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },

  listContainer: { marginBottom: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, paddingRight: 10 },
  bulletDot: { fontSize: 18, color: colors.text, marginRight: 10, lineHeight: 22, fontWeight: 'bold' },
  bulletText: { fontSize: 15, color: colors.text, lineHeight: 24, flex: 1 },

  quoteBox: { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.1)' : '#EBF4FF', borderLeftWidth: 4, borderLeftColor: courseColor, padding: 16, borderRadius: 8, marginVertical: 20 },
  quoteText: { fontSize: 15, color: colors.textMuted, fontStyle: 'italic', lineHeight: 24 },

  interactiveBox: { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.1)' : '#E6FFFA', borderLeftWidth: 4, borderLeftColor: colors.success, padding: 20, borderRadius: 12, marginVertical: 20, alignItems: 'center' },
  interactiveBoxText: { fontSize: 14, color: colors.success, textAlign: 'center', lineHeight: 22 },
  interactiveLink: { fontSize: 14, color: colors.success, textDecorationLine: 'underline', fontWeight: 'bold', marginTop: 8 },
  interactiveWalletBtn: { alignItems: 'center', marginTop: 12 },
  interactiveWalletText: { color: colors.success, fontWeight: 'bold', marginTop: 4 },

  // YouTube Video Player Styles
  videoPlayerContainer: { width: '100%', backgroundColor: colors.cardAlt, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  videoThumbnail: { width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  thumbnailImage: { width: '100%', height: '100%' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  playButton: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  videoDuration: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 8, fontWeight: '500' },

  // Video Modal Styles
  videoModalContainer: { flex: 1, backgroundColor: '#000000' },
  videoModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'android' ? 50 : 10 },
  closeVideoBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  videoModalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', flex: 1, textAlign: 'center', marginLeft: 16 },
  videoModalSpacer: { width: 40 },
  videoPlayerWrapper: { flex: 1, justifyContent: 'center' },
  openInBrowserBtn: { backgroundColor: courseColor, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, gap: 8 },
  openInBrowserText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

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