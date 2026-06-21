import { PrismaClient } from '@prisma/client';
import { errorResponse, successResponse } from '../utils/responseFormatter.js';
import { getDailyInsight, getBaselineAnalysis } from '../services/geminiService.js';
import { estimateAnnualBaseline } from '../services/co2Calculator.js';

const prisma = new PrismaClient();

// Simple in-memory cache for daily tips: userId -> { tip, expiresAt }
const tipCache = new Map();

// Get Daily Tip (Cached for 15 minutes)
export const getDailyTip = async (req, res) => {
  const userId = req.user.id;
  const now = Date.now();

  const cached = tipCache.get(userId);
  if (cached && cached.expiresAt > now) {
    return successResponse(res, { tip: cached.tip }, 'Fetched cached daily tip');
  }

  try {
    // Get user's recent activities
    const recentActivities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10
    });

    const tip = await getDailyInsight(recentActivities);

    // Cache the tip for 15 minutes
    tipCache.set(userId, {
      tip,
      expiresAt: now + 15 * 60 * 1000 // 15 minutes
    });

    return successResponse(res, { tip }, 'Fetched daily tip from Gemini successfully');
  } catch (error) {
    console.error('Error generating daily tip:', error);
    return errorResponse(res, 'Server error generating daily tip', 500);
  }
};

// Get Chart Analytics Data
export const getChartsData = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Weekly bar chart data: CO2 per day for this week (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyActivities = await prisma.activity.findMany({
      where: {
        userId,
        date: { gte: sevenDaysAgo }
      },
      orderBy: { date: 'asc' }
    });

    // Populate day totals
    const daysMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. "Mon"
      const dateStr = d.toISOString().split('T')[0];
      daysMap[dateStr] = { name: dayName, dateStr, co2: 0 };
    }

    weeklyActivities.forEach(act => {
      const dateStr = new Date(act.date).toISOString().split('T')[0];
      if (daysMap[dateStr]) {
        daysMap[dateStr].co2 += act.co2Kg;
      }
    });

    const weeklyChart = Object.values(daysMap);

    // 2. Monthly trend line: last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const monthlyActivities = await prisma.activity.findMany({
      where: {
        userId,
        date: { gte: threeMonthsAgo }
      },
      orderBy: { date: 'asc' }
    });

    const monthsMap = {};
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleDateString('en-US', { month: 'short' }); // e.g. "Oct"
      monthsMap[monthName] = { name: monthName, co2: 0 };
    }

    monthlyActivities.forEach(act => {
      const monthName = new Date(act.date).toLocaleDateString('en-US', { month: 'short' });
      if (monthsMap[monthName]) {
        monthsMap[monthName].co2 += act.co2Kg;
      }
    });

    const monthlyChart = Object.values(monthsMap);

    // 3. Category Donut chart data
    const allActivities = await prisma.activity.findMany({
      where: { userId }
    });

    const categorySums = {
      TRANSPORT: 0,
      FOOD: 0,
      ENERGY: 0,
      SHOPPING: 0
    };

    allActivities.forEach(act => {
      if (categorySums[act.category] !== undefined) {
        categorySums[act.category] += act.co2Kg;
      }
    });

    const breakdownChart = Object.keys(categorySums).map(cat => ({
      name: cat.charAt(0) + cat.slice(1).toLowerCase(),
      value: Math.round(categorySums[cat] * 100) / 100
    }));

    // Find biggest emission source
    let biggestSource = 'None';
    let maxVal = -1;
    Object.keys(categorySums).forEach(cat => {
      if (categorySums[cat] > maxVal) {
        maxVal = categorySums[cat];
        biggestSource = cat;
      }
    });

    if (maxVal === 0) {
      biggestSource = 'No emissions logged yet';
    } else {
      biggestSource = biggestSource.charAt(0) + biggestSource.slice(1).toLowerCase();
    }

    return successResponse(res, {
      weeklyChart,
      monthlyChart,
      breakdownChart,
      biggestSource,
      averageComparison: 15 // Gemini comparison offset mock
    }, 'Fetched analytics data successfully');
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return errorResponse(res, 'Server error fetching charts data', 500);
  }
};

// Save baseline score from onboarding
export const calculateBaseline = async (req, res) => {
  const userId = req.user.id;
  const quizResults = req.body; // { transport, diet, energy, shopping }

  try {
    // Calculate the estimated annual CO2 emissions
    const baselineScore = estimateAnnualBaseline(quizResults);

    // Update user's baseline score in DB
    await prisma.user.update({
      where: { id: userId },
      data: { baselineScore }
    });

    // Query Gemini for personal baseline breakdown and tips
    let geminiAnalysis = '';
    try {
      geminiAnalysis = await getBaselineAnalysis(quizResults, baselineScore);
    } catch (geminiErr) {
      console.error('Gemini baseline analysis failed:', geminiErr);
      geminiAnalysis = `Your estimated footprint is ${baselineScore} kg CO2/year. Reduce transit emissions, buy fewer clothes, and check energy leaks.`;
    }

    return successResponse(res, {
      baselineScore,
      geminiAnalysis
    }, 'Baseline score calculated and saved successfully');
  } catch (error) {
    console.error('Error calculating baseline:', error);
    return errorResponse(res, 'Server error calculating baseline', 500);
  }
};
