import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import Tweet from "./models/tweet.js";
import User from "./models/user.js";

// Connect to MongoDB
mongoose.connect("mongodb+srv://alamixboudkhil:Alami1999@cluster0.bshom9p.mongodb.net/?retryWrites=true&w=majority");

// Function to retrieve author IDs from the database
const getAuthorIdsFromDatabase = async () => {
  try {
    const users = await User.find({}, '_id');
    const authorIds = users.map(user => user._id);
    return authorIds;
  } catch (error) {
    console.error("Error retrieving author IDs from the database:", error);
    throw error;
  }
};

// Function to generate fake tweets for each author ID
const generateFakeTweetsForAuthors = async (authorIds, tweetsPerAuthor) => {
  try {
    for (const authorId of authorIds) {
      const tweets = [];
      for (let i = 0; i < tweetsPerAuthor; i++) {
        const fakeTweet = {
          body: faker.lorem.paragraph(3),
          postImage: faker.image.url(),
          type: "tweet",
          originalTweet: null,
          stat: {
            view: faker.number.int({ min: 20 , max: 9999 }),
            retweet: faker.number.int({ min: 20 , max: 9999 }),
            like: faker.number.int({ min: 20 , max: 9999 }),
            bookmark: faker.number.int({ min: 20 , max: 9999 }),
            comment: faker.number.int({ min: 20 , max: 9999 }),
          },
          author: authorId,
          replies: [],
        };
        tweets.push(fakeTweet);
      }
      const insertedTweets = await Tweet.insertMany(tweets);
      
      // Push the created tweets into the tweets array of the user document
      await User.findByIdAndUpdate(authorId, { $push: { tweets: { $each: insertedTweets } } }, { new: true });
      
      console.log(`${tweetsPerAuthor} fake tweets generated for author with ID ${authorId}.`);
    }
  } catch (error) {
    console.error("Error generating fake tweets:", error);
  }
};

// Example usage:
const tweetsPerAuthor = 1;
getAuthorIdsFromDatabase()
  .then(authorIds => {
    generateFakeTweetsForAuthors(authorIds, tweetsPerAuthor);
  })
  .catch(error => {
    console.error("Error:", error);
  });
