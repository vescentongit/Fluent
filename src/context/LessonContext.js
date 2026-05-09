import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

export const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
  const { setXp: setUserXp, xp: userXp, level } = useContext(UserContext);

  const [courses, setCourses] = useState({
    budgeting101: {
      id: 'budgeting101',
      title: 'Budgeting 101',
      duration: '2.5 hours',
      xpReward: 200,
      themeColor: '#447ADF',
      icon: require('../assets/piggy_bank.png'),
      bullets: [
        "The 50/30/20 budgeting rule explained",
        "How to track and categorize your expenses",
        "Setting realistic financial goals",
        "Creating a budget that works for you",
        "Adjusting your budget overtime"
      ],
      requirements: [],
      benefits: [
        "Take control of your money",
        "Reduce financial stress",
        "Save more effectively",
        "Build better spending habits"
      ],
      lessons: [
        { id: 1, title: 'Lesson 1: Introduction to Budgeting', type: 'video', duration: '12 min', status: 'done', xpReward: 20, videoUrl: 'https://youtu.be/IfpAjsytwy0?si=_3X7TQGf5ppIS3Om' },
        { id: 2, title: 'Lesson 2: The 50/30/20 Rule', type: 'article', duration: '15 min', status: 'done', xpReward: 25 },
        { id: 3, title: 'Lesson 3: Tracking Your Expenses', type: 'interactive', duration: '18 min', status: 'done', xpReward: 30 },
        { id: 4, title: 'Lesson 4: Creating Your First Budget', type: 'video', duration: '20 min', status: 'done', xpReward: 25, videoUrl: 'https://youtu.be/tmlVf1ZC2J0?si=SX4wjiNIeOOevh-D' },
        { id: 5, title: 'Lesson 5: Common Budgeting Mistakes', type: 'article', duration: '14 min', status: 'done', xpReward: 20 },
        { id: 6, title: 'Lesson 6: Budgeting for Irregular Income', type: 'video', duration: '16 min', status: 'done', xpReward: 25, videoUrl: 'https://youtu.be/0djeUYALXe0?si=wOj_6HC964Gkr6XL' },
        { id: 7, title: 'Lesson 7: Adjusting Your Budget', type: 'article', duration: '12 min', status: 'pending', xpReward: 20 },
        { id: 8, title: 'Lesson 8: Budgeting Tools & Apps', type: 'interactive', duration: '12 min', status: 'pending', xpReward: 35 },
      ],
      quizzes: [
        { id: 1, title: 'Budgeting Basics Quiz', desc: 'Test your understanding of fundamental budgeting concepts!', questionsCount: 5, xpReward: 50, status: 'pending', unlockCondition: 'Finish min. 3 lessons to unlock this quiz!' },
        { id: 2, title: 'Advanced Budgeting Scenarios', desc: 'Apply budgeting concepts to real-world situations', questionsCount: 10, xpReward: 100, status: 'locked', unlockCondition: 'Finish all lessons to unlock this quiz!' }
      ]
    },
    investingBasics: {
      id: 'investingBasics',
      title: 'Investing Basics',
      duration: '2 hours',
      xpReward: 350,
      themeColor: '#44CEBE',
      icon: require('../assets/investing_graph.png'),
      bullets: [
        "Understanding stocks, bonds, and mutual funds",
        "Risk tolerance and investment strategy",
        "Indonesian investment landscape (Reksa Dana, stocks)",
        "Diversification principles",
        "Starting with small amounts",
        "Long-term vs. short-term investing"
      ],
      requirements: [
        "Have emergency fund started",
        "Basic understanding of financial markets"
      ],
      benefits: [
        "Build wealth over time",
        "Beat inflation",
        "Generate passive income",
        "Achieve financial independence"
      ],
      lessons: [
        { id: 1, title: 'Lesson 1: Why Invest?', type: 'video', duration: '15 min', status: 'done', xpReward: 50, videoUrl: 'https://youtu.be/x7msE3tx8QI?si=gw7xYqs7vRDTe6D8' },
        { id: 2, title: 'Lesson 2: Investment Vehicles Explained', type: 'article', duration: '20 min', status: 'done', xpReward: 50 },
        { id: 3, title: 'Lesson 3: Understanding Risk & Return', type: 'interactive', duration: '18 min', status: 'pending', xpReward: 60 },
        { id: 4, title: 'Lesson 4: Getting Started with Reksadana', type: 'video', duration: '22 min', status: 'pending', xpReward: 50, videoUrl: 'https://youtu.be/JUtes-k-VX4?si=L4PbqpzLR6E9BxsG' },
        { id: 5, title: 'Lesson 5: Stock Market Basics', type: 'article', duration: '25 min', status: 'pending', xpReward: 70 },
      ],
      quizzes: [
        { id: 1, title: 'Investment Fundamentals', desc: 'Test your knowledge of basic investment concepts', questionsCount: 5, xpReward: 100, status: 'locked', unlockCondition: 'Finish min. 3 lessons to unlock this quiz!' },
        { id: 2, title: 'Stock Market', desc: 'Apply investment concepts to real-world situations', questionsCount: 5, xpReward: 150, status: 'locked', unlockCondition: 'Finish all lessons to unlock this quiz!' }
      ]
    },
    emergencyFundGuide: {
      id: 'emergencyFundGuide',
      title: 'Emergency Fund Guide',
      duration: '1.5 hours',
      xpReward: 150,
      themeColor: '#3ACB71',
      icon: require('../assets/shield.png'),
      bullets: [
        'Understand what qualifies as a real emergency',
        'Set a practical emergency fund target',
        'Build your fund in clear 90-day milestones',
        'Choose safe and liquid places to store cash',
        'Use and replenish your fund without guilt'
      ],
      requirements: [
        'Has monthly income tracking habit',
        'Ready to save consistently for 3 months'
      ],
      benefits: [
        'Lower financial anxiety',
        'Avoid high-interest debt traps',
        'Respond calmly to sudden expenses',
        'Protect long-term financial goals'
      ],
      lessons: [
        { id: 1, title: 'Lesson 1: Why You Need an Emergency Fund?', type: 'video', duration: '10 min', status: 'done', xpReward: 20, videoUrl: 'https://youtu.be/vftjBTjFlzI?si=X20NJd8tUxWOcglx' },
        { id: 2, title: 'Lesson 2: How Much to Save', type: 'article', duration: '12 min', status: 'done', xpReward: 25 },
        { id: 3, title: 'Lesson 3: Where to Keep Your Emergency Fund?', type: 'article', duration: '15 min', status: 'done', xpReward: 25 },
        { id: 4, title: 'Lesson 4: The 90-Day Build Plan', type: 'interactive', duration: '18 min', status: 'done', xpReward: 30 },
        { id: 5, title: 'Lesson 5: When to Use Your Emergency Fund', type: 'video', duration: '14 min', status: 'done', xpReward: 25, videoUrl: 'https://youtube.com/shorts/YBKl-CgMOVA?si=V38F-aYNpmWiuRJh' },
        { id: 6, title: 'Lesson 6: Replenishing After an Emergency', type: 'article', duration: '11 min', status: 'done', xpReward: 25 },
      ],
      quizzes: [
        { id: 1, title: 'Basic Emergency Fund Quiz', desc: 'Test your understanding of fundamental emergency fund concepts!', questionsCount: 3, xpReward: 50, status: 'done', unlockCondition: 'Finish min. 3 lessons to unlock this quiz!' },
        { id: 2, title: 'Tricky Situations of Emergency', desc: 'Get ready to answer these fun yet advanced situations when you have an emergency fund', questionsCount: 5, xpReward: 75, status: 'done', unlockCondition: 'Finish all lessons to unlock this quiz!' }
      ]
    },
    passiveIncome: {
      id: 'passiveIncome',
      title: 'Passive Income Mastery',
      duration: '3 hours',
      xpReward: 500,
      themeColor: '#F6AD55',
      icon: require('../assets/checkbox.png'),
      bullets: [
        '7 proven strategies to earn while you sleep',
        'Building digital products and online businesses',
        'Real estate investment fundamentals',
        'Stock dividend strategies',
        'Creating and monetizing content',
        'Peer-to-peer lending platforms',
        'Automated business systems'
      ],
      requirements: [
        'Complete all Level 1-3 courses',
        'Have basic investment knowledge',
        'Ready to build long-term wealth'
      ],
      benefits: [
        'Achieve financial independence',
        'Create multiple income streams',
        'Build wealth while you sleep',
        'Reduce dependence on active income'
      ],
      lessons: [
        { id: 1, title: 'Lesson 1: Introduction to Passive Income', type: 'video', duration: '15 min', status: 'pending', xpReward: 50, videoUrl: 'https://youtu.be/sUOIlve7TYE?si=Nnt3BZ6R_RL8SuB5' },
        { id: 2, title: 'Lesson 2: Digital Products & Online Business', type: 'article', duration: '20 min', status: 'pending', xpReward: 60 },
      ],
      quizzes: [
        { id: 1, title: 'Passive Income Fundamentals', desc: 'Test your understanding of basic passive income concepts', questionsCount: 8, xpReward: 100, status: 'locked', unlockCondition: 'Finish all lessons to unlock this quiz!' }
      ]
    }
  });

  useEffect(() => {
    setCourses(prev => {
      let changed = false;
      const next = { ...prev };
      Object.keys(next).forEach(courseKey => {
        const course = { ...next[courseKey] };
        const doneCount = course.lessons.filter(l => l.status === 'done').length;
        const availableLessons = course.lessons.filter(l => l.status !== 'locked').length;
        const allLessonsDone = doneCount >= availableLessons && availableLessons > 0;

        let quizzesChanged = false;
        course.quizzes = course.quizzes.map(q => {
          if (allLessonsDone && q.status === 'locked') {
            quizzesChanged = true;
            return { ...q, status: 'pending' };
          }
          return q;
        });

        if (quizzesChanged) {
          next[courseKey] = course;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [courses]);

  const markLessonDone = (courseId, lessonId) => {
    setCourses(prev => {
      const next = { ...prev };
      const course = { ...next[courseId] };
      
      let lessonAward = 0;
      course.lessons = course.lessons.map(lesson => {
        if (lesson.id === lessonId && lesson.status !== 'done') {
          lessonAward = lesson.xpReward;
          return { ...lesson, status: 'done' };
        }
        return lesson;
      });

      if (lessonAward > 0) {
        let courseAward = 0;
        const allQuizzesDone = course.quizzes.every(q => q.status === 'done');
        const allLessonsDone = course.lessons.every(l => l.status === 'done' || l.status === 'locked');
        if (allQuizzesDone && allLessonsDone && !course.completed) {
           course.completed = true;
           courseAward = course.xpReward;
        }
        setUserXp(prevXp => prevXp + lessonAward + courseAward);
      }

      next[courseId] = course;
      return next;
    });
  };

  const markQuizDone = (courseId, quizId) => {
    setCourses(prev => {
      const next = { ...prev };
      const course = { ...next[courseId] };
      
      let quizAward = 0;
      course.quizzes = course.quizzes.map(quiz => {
        if (quiz.id === quizId && quiz.status !== 'done') {
          quizAward = quiz.xpReward;
          return { ...quiz, status: 'done' };
        }
        return quiz;
      });

      if (quizAward > 0) {
        let courseAward = 0;
        const allQuizzesDone = course.quizzes.every(q => q.status === 'done');
        const allLessonsDone = course.lessons.every(l => l.status === 'done' || l.status === 'locked');
        if (allQuizzesDone && allLessonsDone && !course.completed) {
           course.completed = true;
           courseAward = course.xpReward;
        }
        setUserXp(prevXp => prevXp + quizAward + courseAward);
      }

      next[courseId] = course;
      return next;
    });
  };

  const getCourseProgress = (courseId) => {
    const course = courses[courseId];
    if (!course) return 0;
    const totalItems = course.lessons.length + course.quizzes.length;
    const completedItems = course.lessons.filter(l => l.status === 'done').length + course.quizzes.filter(q => q.status === 'done').length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <LessonContext.Provider value={{ courses, lessons: courses.budgeting101.lessons, quizzes: courses.budgeting101.quizzes, markLessonDone, markQuizDone, xp: userXp, getCourseProgress, progressPercentage: getCourseProgress('budgeting101') }}>
      {children}
    </LessonContext.Provider>
  );
};