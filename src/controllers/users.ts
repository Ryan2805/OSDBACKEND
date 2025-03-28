import { Request, Response } from 'express';
import { usersCollection } from '../database';
import * as argon2 from "argon2"; // For hashing passwords
import { ValidateUser, User } from "../models/user"; 
import { error } from 'console';
// Placeholder for getting all users
export const getUsers = (req: Request, res: Response) => {
  res.json({ message: "getUsers received" });
};


export const getTotalUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Log the request to ensure the function is being hit
    console.log('Fetching total users...');
    
   
    const totalUsers = await usersCollection.countDocuments();

    
    console.log('Total users:', totalUsers);

  
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error getting total users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// user by id
export const getUserById = (req: Request, res: Response) => {
  const id: string = req.params.id;
  res.json({ message: `get a user ${id} received` });
};

// creating a new user
// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate user input
    const validationResult = ValidateUser(req.body);
    if (validationResult.error) {
      res.status(400).json(validationResult.error);
      return;
    }

    const existingUser = await usersCollection.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(400).json({ error: "A user with this email already exists." });
      return;
    }

    // Assign role, default to 'user'
    const newUser: User = {
      name: req.body.name,
      phonenumber: req.body.phonenumber,
      email: req.body.email.toLowerCase(),
      dateJoined: new Date(),
      lastUpdated: new Date(),
      role: 'user', // Default role
    };

    //  Hash the password
    newUser.hashedPassword = await argon2.hash(req.body.password);

    //  Save the user to the database
    const result = await usersCollection.insertOne(newUser);
    if (result) {
      res
        .status(201)
        .location(`${result.insertedId}`)
        .json({
          message: `Created a new user with ID: ${result.insertedId}`,
        });
    } else {
      res.status(500).send("Failed to create a new user.");
    }
  } catch (error: unknown) {  // Specify the type as 'unknown'
    if (error instanceof Error) {  // Check if 'error' is an instance of Error
      console.error(`Error creating user: ${error.message}`);
    } else {
      console.error('An unknown error occurred.');
    }
    res.status(500).send("An error occurred while creating the user.");
  }
};

