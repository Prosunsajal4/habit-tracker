export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getWeeksInMonth = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [];
  
  let currentWeek = [];
  let dayCounter = 1;
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }
  
  // Add days of the month
  while (dayCounter <= daysInMonth) {
    currentWeek.push(dayCounter);
    dayCounter++;
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Add remaining days to the last week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks;
};

export const getWeekNumber = (year, month, day) => {
  const date = new Date(year, month, day);
  const firstDay = new Date(year, month, 1).getDay();
  return Math.ceil((day + firstDay) / 7);
};

export const formatDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const calculateCompletionRate = (habit, completions, year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  let completedDays = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDate(year, month, day);
    if (completions[dateKey]?.includes(habit.id)) {
      completedDays++;
    }
  }
  
  return {
    completed: completedDays,
    total: habit.goalDays || daysInMonth,
    percentage: habit.goalDays ? (completedDays / habit.goalDays) * 100 : (completedDays / daysInMonth) * 100
  };
};

export const getMonthName = (month) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
};
