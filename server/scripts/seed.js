require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Worker = require("../models/Worker");
const OpenJob = require("../models/OpenJob");

const DEMO_CLIENT_EMAIL = "democlient@kaam.app";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashed = await bcrypt.hash("demo12345", 10);
  let demoClient = await User.findOne({ email: DEMO_CLIENT_EMAIL });
  if (!demoClient) {
    demoClient = await User.create({
      email: DEMO_CLIENT_EMAIL,
      password: hashed,
      firstName: "Demo",
      lastName: "Client",
      role: "client",
    });
    console.log("Created demo client:", DEMO_CLIENT_EMAIL);
  }

  const DEMO_WORKER_EMAIL = "workerdemo@kaam.app";
  const workerPass = await bcrypt.hash("worker12345", 10);
  let demoWorkerUser = await User.findOne({ email: DEMO_WORKER_EMAIL });
  if (!demoWorkerUser) {
    demoWorkerUser = await User.create({
      email: DEMO_WORKER_EMAIL,
      password: workerPass,
      firstName: "Demo",
      lastName: "Worker",
      role: "worker",
    });
    console.log("Created demo worker login:", DEMO_WORKER_EMAIL, "/ worker12345");
  }
  await Worker.findOneAndUpdate(
    { name: "Amit Verma" },
    { $set: { userId: demoWorkerUser._id } }
  );

  const workersData = [
    {
      name: "Rajesh Sharma",
      profession: "Plumber",
      professions: ["Plumber"],
      experience: 8,
      location: "Indiranagar, Bengaluru",
      rating: 4.9,
      hourlyRate: 499,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "Master plumber & sanitisation specialist.",
    },
    {
      name: "Amit Verma",
      profession: "Electrician",
      professions: ["Electrician"],
      experience: 5,
      location: "HSR Layout, Bengaluru",
      rating: 4.8,
      hourlyRate: 350,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      bio: "Expert electrician — wiring, AC, and smart home.",
    },
    {
      name: "Priya Das",
      profession: "Cleaner",
      professions: ["Cleaner"],
      experience: 3,
      location: "Koramangala, Bengaluru",
      rating: 4.7,
      hourlyRate: 299,
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      bio: "Professional home styling & deep cleaning.",
    },
  ];

  for (const w of workersData) {
    const exists = await Worker.findOne({ name: w.name });
    if (!exists) {
      await Worker.create(w);
      console.log("Seeded worker:", w.name);
    }
  }

  const count = await OpenJob.countDocuments();
  if (count === 0) {
    await OpenJob.insertMany([
      {
        title: "Kitchen leak repair",
        service: "Plumbing",
        distanceKm: 1.2,
        price: 2450,
        description: "Emergency pipe burst in main kitchen area.",
        clientId: demoClient._id,
      },
      {
        title: "AC filter maintenance",
        service: "Electrician",
        distanceKm: 4.2,
        price: 800,
        description: "Routine check for two split AC units.",
        clientId: demoClient._id,
      },
      {
        title: "Full home deep clean",
        service: "Cleaner",
        distanceKm: 0.8,
        price: 1200,
        description: "2BHK deep sanitisation.",
        clientId: demoClient._id,
      },
    ]);
    console.log("Seeded open jobs");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
