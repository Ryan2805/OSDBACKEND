import { Router } from 'express';

import { handleLogin } from '../controllers/auth';
const router = Router();

// Define the /auth route
router.post('/', handleLogin);

export default router;
