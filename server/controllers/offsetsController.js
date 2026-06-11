import { PrismaClient } from '@prisma/client';
import { errorResponse, successResponse } from '../utils/responseFormatter.js';

const prisma = new PrismaClient();

const DEFAULT_OFFSETS = [
  {
    name: "Rajasthan Solar Farm",
    country: "India",
    pricePerTon: 12.0,
    verified: true,
    description: "Clean energy solar power plant in Rajasthan, India, replacing fossil fuel grid reliance.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Amazon Rainforest Protection",
    country: "Brazil",
    pricePerTon: 18.0,
    verified: true,
    description: "Conservation project protecting high-risk areas of the Amazon rainforest from illegal logging.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Kenya Cookstoves Project",
    country: "Kenya",
    pricePerTon: 9.0,
    verified: true,
    description: "Providing high-efficiency cookstoves to families in rural Kenya, reducing wood usage and smoke emissions.",
    imageUrl: "https://images.unsplash.com/photo-1599824436794-5b4cf006a88b?auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Scottish Wind Energy",
    country: "UK",
    pricePerTon: 15.0,
    verified: true,
    description: "Wind turbine farm installation generating clean electricity in the Scottish Highlands.",
    imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Mangrove Restoration Goa",
    country: "India",
    pricePerTon: 11.0,
    verified: true,
    description: "Planting mangrove trees along estuaries in Goa, India, to restore coastal ecosystems and absorb blue carbon.",
    imageUrl: "https://images.unsplash.com/photo-1500627869374-13ad991b1116?auto=format&fit=crop&w=500&q=80"
  }
];

// Fetch all available offset projects
export const getOffsets = async (req, res) => {
  try {
    let offsets = await prisma.offset.findMany();

    // Auto seed if empty
    if (offsets.length === 0) {
      await prisma.offset.createMany({
        data: DEFAULT_OFFSETS
      });
      offsets = await prisma.offset.findMany();
    }

    return successResponse(res, offsets, 'Offsets retrieved successfully');
  } catch (error) {
    console.error('Error fetching offsets:', error);
    return errorResponse(res, 'Server error fetching offsets', 500);
  }
};

// Pledge to an offset project (recorded as a negative CO2 activity)
export const pledgeOffset = async (req, res) => {
  const userId = req.user.id;
  const { offsetId, tons } = req.body;

  if (!offsetId || !tons) {
    return errorResponse(res, 'Offset ID and tons to offset are required', 400);
  }

  try {
    const project = await prisma.offset.findUnique({
      where: { id: offsetId }
    });

    if (!project) {
      return errorResponse(res, 'Offset project not found', 404);
    }

    const co2SavedKg = parseFloat(tons) * 1000; // 1 ton = 1000 kg CO2
    
    // Create an Activity record representing the offset (with negative CO2 value)
    const activity = await prisma.activity.create({
      data: {
        userId,
        category: 'ENERGY',
        description: `Offset pledge: ${tons} ton(s) via "${project.name}"`,
        co2Kg: -co2SavedKg, // negative emissions
        date: new Date()
      }
    });

    return successResponse(res, { activity }, `Successfully pledged to offset ${tons} ton(s) through "${project.name}"!`);
  } catch (error) {
    console.error('Error pledging offset:', error);
    return errorResponse(res, 'Server error recording offset pledge', 500);
  }
};
