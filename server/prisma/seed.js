import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CHALLENGES = [
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

const OFFSETS = [
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

async function main() {
  console.log("Starting database seeding...");

  // Seed challenges
  console.log("Seeding challenges...");
  for (const chal of CHALLENGES) {
    const existing = await prisma.challenge.findFirst({
      where: { title: chal.title }
    });

    if (existing) {
      await prisma.challenge.update({
        where: { id: existing.id },
        data: chal
      });
      console.log(`Updated challenge: ${chal.title}`);
    } else {
      await prisma.challenge.create({
        data: chal
      });
      console.log(`Created challenge: ${chal.title}`);
    }
  }

  // Seed offsets
  console.log("Seeding offset projects...");
  for (const offset of OFFSETS) {
    const existing = await prisma.offset.findFirst({
      where: { name: offset.name }
    });

    if (existing) {
      await prisma.offset.update({
        where: { id: existing.id },
        data: offset
      });
      console.log(`Updated offset project: ${offset.name}`);
    } else {
      await prisma.offset.create({
        data: offset
      });
      console.log(`Created offset project: ${offset.name}`);
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
