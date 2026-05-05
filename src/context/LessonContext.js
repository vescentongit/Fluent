import React, { createContext, useState, useEffect } from 'react';

export const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
  const [xp, setXp] = useState(6767); 

  const [lessons, setLessons] = useState([
    { id: 1, title: 'Lesson 1: Introduction to Budgeting', type: 'video', duration: '12 min', status: 'done', xpReward: 20 },
    { id: 2, title: 'Lesson 2: The 50/30/20 Rule', type: 'article', duration: '15 min', status: 'done', xpReward: 25 },
    { id: 3, title: 'Lesson 3: Tracking Your Expenses', type: 'interactive', duration: '18 min', status: 'done', xpReward: 30 },
    { id: 4, title: 'Lesson 4: Creating Your First Budget', type: 'video', duration: '20 min', status: 'done', xpReward: 25 },
    { id: 5, title: 'Lesson 5: Common Budgeting Mistakes', type: 'article', duration: '14 min', status: 'done', xpReward: 20 },
    { id: 6, title: 'Lesson 6: Budgeting for Irregular Income', type: 'video', duration: '16 min', status: 'done', xpReward: 25 },
    { id: 7, title: 'Lesson 7: Adjusting Your Budget', type: 'article', duration: '12 min', status: 'pending', xpReward: 20 },
    { id: 8, title: 'Lesson 8: Budgeting Tools & Apps', type: 'interactive', duration: '12 min', status: 'pending', xpReward: 35 },
  ]);

  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Budgeting Basics Quiz', desc: 'Test your understanding of fundamental budgeting concepts!', questionsCount: 5, xpReward: 50, status: 'pending' },
    { id: 2, title: 'Advanced Budgeting Scenarios', desc: 'Apply budgeting concepts to real-world situations', questionsCount: 10, xpReward: 100, status: 'locked' }
  ]);

  useEffect(() => {
    const allLessonsDone = lessons.every(l => l.status === 'done');
    if (allLessonsDone) {
      setQuizzes(prev => prev.map(q => q.id === 2 && q.status === 'locked' ? { ...q, status: 'pending' } : q));
    }
  }, [lessons]);

  const markLessonDone = (id) => {
    setLessons(prev => prev.map(lesson => {
      if (lesson.id === id && lesson.status !== 'done') {
        setXp(prevXp => prevXp + lesson.xpReward);
        return { ...lesson, status: 'done' };
      }
      return lesson;
    }));
  };

  const markQuizDone = (id) => {
    setQuizzes(prev => prev.map(quiz => {
      if (quiz.id === id && quiz.status !== 'done') {
        setXp(prevXp => prevXp + quiz.xpReward);
        return { ...quiz, status: 'done' };
      }
      return quiz;
    }));
  };

  const totalItems = lessons.length + quizzes.length;
  const completedItems = lessons.filter(l => l.status === 'done').length + quizzes.filter(q => q.status === 'done').length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <LessonContext.Provider value={{ lessons, quizzes, markLessonDone, markQuizDone, xp, progressPercentage }}>
      {children}
    </LessonContext.Provider>
  );
};