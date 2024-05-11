import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";
import User from "./models/user.js"; // Assuming your User model is in a file named UserModel.js

// Connect to MongoDB
mongoose.connect("mongodb+srv://alamixboudkhil:Alami1999@cluster0.bshom9p.mongodb.net/?retryWrites=true&w=majority",);

// Function to generate fake users
const generateFakeUsers = async (numUsers) => {
  try {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
    const password = "test123"
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);// Hashing the fake password
      const fakeUser = {
        tag: faker.internet.userName(),
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash, // Using the hashed password
        dob: faker.date.past().toISOString(),
        profileImage: faker.image.avatar(),
        bannerImage: faker.image.url(),
        bio: faker.person.bio(),
      };
      users.push(fakeUser);
    }
    await User.insertMany(users);
    console.log(`${numUsers} fake users generated and saved.`);
  } catch (error) {
    console.error("Error generating fake users:", error);
  }
};

generateFakeUsers(10);
