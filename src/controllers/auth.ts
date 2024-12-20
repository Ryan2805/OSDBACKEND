import { Request, Response } from 'express';
import { usersCollection } from "../database";
import * as argon2 from 'argon2';
import { sign as jwtSign } from 'jsonwebtoken';
import { User } from '../models/user';

export const handleLogin = async (req: Request, res: Response) => {
    console.log("Login request received.");
    console.log("Request Body:", req.body);

    const email = req.body?.email;
    const password = req.body?.password;

    if (!email || !password) {
        console.log("Email or password missing.");
        res.status(400).json({ message: 'Email and password are required.' });
        return;
    }

    try {
        console.log("Looking for user with email:", email.toLowerCase());
        const user = (await usersCollection.findOne({ email: email.toLowerCase() })) as User | null;
        console.log("User Found:", user);

        if (!user) {
            console.log("User not found.");
            const dummyPassword = 'dummy_password';
            const dummyHash = await argon2.hash(dummyPassword);
            await argon2.verify(dummyHash, password); // Consistent timing
            res.status(401).json({ message: 'Invalid email or password!' });
            return;
        }

        if (!user.hashedPassword) {
            console.log("User has no hashed password.");
            res.status(401).json({ message: 'Invalid email or password!' });
            return;
        }

        console.log("Verifying password...");
        const isPasswordValid = await argon2.verify(user.hashedPassword, password);
        console.log("Password Validation Result:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("Invalid password.");
            res.status(401).json({ message: 'Invalid email or password!' });
            return;
        }

        const accessToken = createAccessToken(user);
        console.log("Generated Access Token:", accessToken);

        res.status(201).send({ accessToken });

    } catch (error) {
        console.error(`Error during login: ${error}`);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};

const createAccessToken = (user: User): string => {
    const secret = process.env.JWTSECRET || 'not very secret';
    const expiresInRaw = process.env.JWTEXPIRES || '60'; // Default to 60 seconds

    // Explicitly convert to a number if it's numeric
    const expiresIn = isNaN(Number(expiresInRaw)) ? expiresInRaw : Number(expiresInRaw);

    console.log("JWT Expires In Value:", expiresIn); // Debugging
    console.log("ExpiresIn Type:", typeof expiresIn); // Check the type

    const payload = {
        email: user.email,
        name: user.name
    };

    // Pass the corrected `expiresIn` to jwtSign
    return jwtSign(payload, secret, { expiresIn });
};
