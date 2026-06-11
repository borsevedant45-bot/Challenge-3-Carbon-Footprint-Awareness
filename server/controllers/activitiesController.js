import { PrismaClient } from '@prisma/client';
import { errorResponse, successResponse } from '../utils/responseFormatter.js';
import { getActivityTip } from '../services/geminiService.js';

const prisma = new PrismaClient();

// Get recent activities for logged in user
export const getActivities = async (req, res) => {
  const userId = req.user.id;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;

  try {
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit
    });
    return successResponse(res, activities, 'Fetched recent activities successfully');
  } catch (error) {
    console.error('Error fetching activities:', error);
    return errorResponse(res, 'Server error fetching activities', 500);
  }
};

// Log a new activity
export const createActivity = async (req, res) => {
  const userId = req.user.id;
  const { category, description, co2Kg, date } = req.body;

  try {
    const activityDate = date ? new Date(date) : new Date();

    const activity = await prisma.activity.create({
      data: {
        userId,
        category,
        description,
        co2Kg: parseFloat(co2Kg),
        date: activityDate
      }
    });

    // Trigger Gemini for a contextual micro-tip
    let microTip = '';
    try {
      microTip = await getActivityTip(description, co2Kg, category);
    } catch (geminiError) {
      console.error('Gemini Service Failed, fallback will be used', geminiError);
      microTip = 'Great job logging! Keep track of your emissions to find areas for reduction.';
    }

    return successResponse(res, { activity, microTip }, 'Activity logged successfully', 201);
  } catch (error) {
    console.error('Error logging activity:', error);
    return errorResponse(res, 'Server error logging activity', 500);
  }
};

// Get category totals
export const getSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    // We want to calculate totals per category for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyActivities = await prisma.activity.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    const categoryTotals = {
      TRANSPORT: 0,
      FOOD: 0,
      ENERGY: 0,
      SHOPPING: 0
    };

    let monthlyTotal = 0;
    monthlyActivities.forEach(act => {
      if (categoryTotals[act.category] !== undefined) {
        categoryTotals[act.category] += act.co2Kg;
      }
      monthlyTotal += act.co2Kg;
    });

    // Also get streak counter
    // Let's implement streak calculation based on activity dates
    const allActivities = await prisma.activity.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' }
    });

    const streak = calculateStreak(allActivities.map(a => a.date));

    // Get active goals
    const activeGoal = await prisma.goal.findFirst({
      where: {
        userId,
        achieved: false,
        deadline: { gte: new Date() }
      },
      orderBy: { deadline: 'asc' }
    });

    return successResponse(res, {
      categoryTotals,
      monthlyTotal,
      streak,
      activeGoal
    }, 'Fetched summary details successfully');
  } catch (error) {
    console.error('Error fetching summary:', error);
    return errorResponse(res, 'Server error fetching summary details', 500);
  }
};

// Helper: Calculate daily activity streak
const calculateStreak = (dates) => {
  if (dates.length === 0) return 0;

  // Format all dates to YYYY-MM-DD and remove duplicates
  const uniqueDates = Array.from(new Set(
    dates.map(d => new Date(d).toISOString().split('T')[0])
  )).sort((a, b) => new Date(b) - new Date(a)); // Sort descending (today/yesterday first)

  let streak = 0;
  let today = new Date();
  let checkDate = new Date();
  
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If the user hasn't logged anything today or yesterday, streak is 0
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  // Set start of check
  let expectedStr = uniqueDates[0];
  let currentDate = new Date(expectedStr);

  for (let i = 0; i < uniqueDates.length; i++) {
    if (uniqueDates[i] === expectedStr) {
      streak++;
      // Set to day before
      currentDate.setDate(currentDate.getDate() - 1);
      expectedStr = currentDate.toISOString().split('T')[0];
    } else {
      break;
    }
  }

  return streak;
};
