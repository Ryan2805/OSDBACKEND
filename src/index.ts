import morgan from "morgan";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from './routes/auth';
import { connectToDatabase } from "./database";
import userRoutes from './routes/users';

const PORT = process.env.PORT || 3000;

const app: Application = express();

// Middleware
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.get("/ping", async (_req: Request, res: Response) => {
  res.send({
    message: "hello from Una",
  });
});

app.get("/bananas", async (_req: Request, res: Response) => {
  res.send('hello world, this is bananas');
});

// Connect to MongoDB and start server
connectToDatabase()
  .then(() => {
    console.log("Database connected. Starting server...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to database", err);
  });

