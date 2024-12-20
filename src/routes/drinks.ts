import express, { Router } from 'express';
import {
    getDrinks,
    getDrinkById,
    createDrink,
    updateDrink,
    deleteDrink,
    
} from '../controllers/drinks'; 

const router: Router = express.Router();

router.get('/', getDrinks);
router.get('/:id', getDrinkById);
router.post('/', createDrink);
router.put('/:id', updateDrink);
router.delete('/:id', deleteDrink);


export default router;