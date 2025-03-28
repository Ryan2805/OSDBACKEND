
import { Request, Response } from 'express';
import { getDrinks } from './drinks'; 
import { getUsers } from './users';  

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
   
    const users = await getUsers(req, res);  
    const drinks = await getDrinks(req, res);

    // Return both sets of data as an object
    res.status(200).json({ users, drinks });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ error: 'An error occurred while fetching admin dashboard data.' });
  }
};
