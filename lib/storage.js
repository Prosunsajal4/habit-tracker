// Local storage utilities for habit tracker

const STORAGE_KEY = 'habit-tracker-data';

export const getStoredData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const setStoredData = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const getHabits = () => {
  const data = getStoredData();
  return data?.habits || [];
};

export const setHabits = (habits) => {
  const data = getStoredData() || {};
  data.habits = habits;
  setStoredData(data);
};

export const getCompletions = () => {
  const data = getStoredData();
  return data?.completions || {};
};

export const setCompletions = (completions) => {
  const data = getStoredData() || {};
  data.completions = completions;
  setStoredData(data);
};

export const getSelectedMonth = () => {
  const data = getStoredData();
  return data?.selectedMonth || { year: new Date().getFullYear(), month: new Date().getMonth() };
};

export const setSelectedMonth = (year, month) => {
  const data = getStoredData() || {};
  data.selectedMonth = { year, month };
  setStoredData(data);
};
