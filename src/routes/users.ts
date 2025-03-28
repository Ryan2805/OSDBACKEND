import express, { Router } from 'express';
import { validJWTProvided, isAdmin } from '../middleware/auth.middleware';
import { getUsers, getUserById, createUser, getTotalUsers } from '../controllers/users';

const router: Router = express.Router();





router.get('/:id', validJWTProvided, getUserById);

router.get('/allusers', getTotalUsers);
router.post("/signup", createUser);

export default router;
