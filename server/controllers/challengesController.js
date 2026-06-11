import { PrismaClient } from '@prisma/client';
import { errorResponse, successResponse } from '../utils/responseFormatter.js';

const prisma = new PrismaClient();

const DEFAULT_CHALLENGES = [
  {
    title: "Car-Free Monday",
    category: "TRANSPORT",
    durationDays: 7,
    co2SavedKg: 8.5,
    iconName: "car-off",
    description: "Leave your car at home for a Monday and use public transit, walk, or cycle to reduce transport emissions."
  },
  {
    title: "Plant-Based Week",
    category: "FOOD",
    durationDays: 7,
    co2SavedKg: 18.9,
    iconName: "leaf",
    description: "Eat plant-based meals for a week to reduce greenhouse gas emissions associated with meat production."
  },
  {
    title: "Cold Shower Week",
    category: "ENERGY",
    durationDays: 7,
    co2SavedKg: 2.1,
    iconName: "droplet",
    description: "Take cold showers for 7 days to save hot water heating energy and boost your alertness."
  },
  {
    title: "No New Clothes Month",
    category: "SHOPPING",
    durationDays: 30,
    co2SavedKg: 40.0,
    iconName: "shirt",
    description: "Refrain from buying any new apparel for 30 days to combat fast fashion environmental impacts."
  },
  {
    title: "Cycle to Work",
    category: "TRANSPORT",
    durationDays: 14,
    co2SavedKg: 12.6,
    iconName: "bike",
    description: "Bicycle to work or school for two weeks instead of driving or using motor transport."
  },
  {
    title: "Zero Waste Kitchen",
    category: "FOOD",
    durationDays: 14,
    co2SavedKg: 9.8,
    iconName: "trash-x",
    description: "Reduce kitchen waste by avoiding single-use plastics and planning meals to minimize food waste."
  },
  {
    title: "Switch to LED",
    category: "ENERGY",
    durationDays: 1,
    co2SavedKg: 1.2,
    iconName: "bulb",
    description: "Swap out old incandescent or halogen bulbs with energy-efficient LED light bulbs."
  },
  {
    title: "Second Hand Only",
    category: "SHOPPING",
    durationDays: 30,
    co2SavedKg: 55.0,
    iconName: "recycle",
    description: "Only buy pre-owned, vintage, or second-hand items for a full month."
  }
];

// Fetch all available challenges
export const getChallenges = async (req, res) => {
  try {
    let challenges = await prisma.challenge.findMany();

    // Auto seed if empty
    if (challenges.length === 0) {
      await prisma.challenge.createMany({
        data: DEFAULT_CHALLENGES
      });
      challenges = await prisma.challenge.findMany();
    }

    return successResponse(res, challenges, 'Challenges retrieved successfully');
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return errorResponse(res, 'Server error fetching challenges', 500);
  }
};

// Fetch user's active/completed challenges
export const getUserChallenges = async (req, res) => {
  const userId = req.user.id;

  try {
    const userChallenges = await prisma.userChallenge.findMany({
      where: { userId },
      include: {
        challenge: true
      },
      orderBy: { startDate: 'desc' }
    });

    return successResponse(res, userChallenges, 'User challenges retrieved successfully');
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    return errorResponse(res, 'Server error fetching user challenges', 500);
  }
};

// Join a challenge
export const joinChallenge = async (req, res) => {
  const userId = req.user.id;
  const { challengeId } = req.body;

  if (!challengeId) {
    return errorResponse(res, 'Challenge ID is required', 400);
  }

  try {
    const existing = await prisma.userChallenge.findFirst({
      where: {
        userId,
        challengeId,
        status: 'ACTIVE'
      }
    });

    if (existing) {
      return errorResponse(res, 'You are already participating in this challenge', 400);
    }

    const newUserChallenge = await prisma.userChallenge.create({
      data: {
        userId,
        challengeId,
        status: 'ACTIVE'
      },
      include: {
        challenge: true
      }
    });

    return successResponse(res, newUserChallenge, 'Successfully joined challenge', 201);
  } catch (error) {
    console.error('Error joining challenge:', error);
    return errorResponse(res, 'Server error joining challenge', 500);
  }
};

// Complete a challenge
export const completeChallenge = async (req, res) => {
  const userId = req.user.id;
  const { userChallengeId } = req.body;

  if (!userChallengeId) {
    return errorResponse(res, 'User Challenge ID is required', 400);
  }

  try {
    const userChallenge = await prisma.userChallenge.findUnique({
      where: { id: userChallengeId }
    });

    if (!userChallenge || userChallenge.userId !== userId) {
      return errorResponse(res, 'Challenge subscription not found', 404);
    }

    if (userChallenge.status !== 'ACTIVE') {
      return errorResponse(res, 'Challenge is already completed or failed', 400);
    }

    const updated = await prisma.userChallenge.update({
      where: { id: userChallengeId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      },
      include: {
        challenge: true
      }
    });

    return successResponse(res, updated, 'Congratulations! Challenge completed!');
  } catch (error) {
    console.error('Error completing challenge:', error);
    return errorResponse(res, 'Server error completing challenge', 500);
  }
};
