import express, { Router } from 'express';
import { validJWTProvided } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/auth.middleware';
import { getAdminDashboard } from '../controllers/admin';  

const router: Router = express.Router();


router.get('/admin/dashboard', validJWTProvided, isAdmin, getAdminDashboard);

export default router;

