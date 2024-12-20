import { Request, Response } from 'express';
import { drinksCollection } from "../database";
import { ObjectId } from 'mongodb';
import Drink from '../models/drinks';

// Get all drinks
export const getDrinks = async (req: Request, res: Response) => {
  try {
    const drinks = (await drinksCollection.find({}).toArray());
    res.status(200).json(drinks);
  } catch (error) {
    res.status(500).send("Oops! Something went wrong.");
  }
};

// Get a specific drink by its ID
export const getDrinkById = async (req: Request, res: Response) => {
  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const drink = (await drinksCollection.findOne(query));

    if (drink) {
      res.status(200).send(drink);
    } else {
      res.status(404).send(`No drink found with id: ${req.params.id}`);
    }
  } catch (error) {
    res.status(500).send("An error occurred while retrieving the drink.");
  }
};

// Create a new drink
export const createDrink = async (req: Request, res: Response) => {
  try {
    const newDrink = req.body as Drink;
    const result = await drinksCollection.insertOne(newDrink);

    if (result) {
      res.status(201).location(`${result.insertedId}`).json({ message: `Created a new drink with id ${result.insertedId}` });
    } else {
      res.status(500).send("Failed to create a new drink.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(`Unable to create new drink`);
  }
};

// Update an existing drink by its ID
export const updateDrink = async (req: Request, res: Response) => {
  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const updatedDrink = req.body as Drink;
    const result = await drinksCollection.updateOne(query, { $set: updatedDrink });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: `Updated drink with id ${id}` });
    } else {
      res.status(404).json({ message: `No drink found with id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Unable to update drink.");
  }
};

// Delete a drink by its ID
export const deleteDrink = async (req: Request, res: Response) => {
  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await drinksCollection.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).json({ message: `Successfully removed drink with id ${id}` });
    } else if (!result) {
      res.status(400).json({ message: `Failed to remove drink with id ${id}` });
    } else {
      res.status(404).json({ message: `No drink found with id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};
