import { connectDB } from "../libs/db.js";
import { configDotenv } from "dotenv";
import User from "../models/user.model.js";
configDotenv();

const seedUsers = [
  // Female Users
  {
    email: "priya.sharma@example.com",
    fullname: "Priya Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "neha.patel@example.com",
    fullname: "Neha Patel",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "anjali.singh@example.com",
    fullname: "Anjali Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "divya.gupta@example.com",
    fullname: "Divya Gupta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "meera.verma@example.com",
    fullname: "Meera Verma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "shreya.joshi@example.com",
    fullname: "Shreya Joshi",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "pooja.khanna@example.com",
    fullname: "Pooja Khanna",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "ritika.agarwal@example.com",
    fullname: "Ritika Agarwal",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "rahul.kumar@example.com",
    fullname: "Rahul Kumar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "vikas.reddy@example.com",
    fullname: "Vikas Reddy",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "amit.malhotra@example.com",
    fullname: "Amit Malhotra",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "rohit.choudhary@example.com",
    fullname: "Rohit Choudhary",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "sunil.mehta@example.com",
    fullname: "Sunil Mehta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "deepak.bansal@example.com",
    fullname: "Deepak Bansal",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "nikhil.kapoor@example.com",
    fullname: "Nikhil Kapoor",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to the database");

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
seedDatabase();