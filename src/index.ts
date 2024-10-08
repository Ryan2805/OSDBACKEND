import morgan from "morgan";
import express, {Application, Request, Response} from "express" ;

const PORT = process.env.PORT || 3000;

const app: Application = express();
import userRoutes from './routes/users';


app.get("/ping", async (_req : Request, res: Response) => {
    res.send({
    message: "hello from Una",
    });
});
app.get("/bananas", async (_req: Request, res: Response) => {
    res.send('hello world, this is bananas');
  });


 app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });
    app.use(morgan("tiny"));
    app.use('/api/v1/users', userRoutes)
    app.use(express.json());
    app.use('/api/v1/users', userRoutes)
