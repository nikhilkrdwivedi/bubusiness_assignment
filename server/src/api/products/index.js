/**
 @author Nikhil Kumar
 @date    20/03/2030
*/
import { Router } from 'express';

const router = Router();

import { postProducts, getProducts, updateProducts, deleteProducts } from './products.controller';
router.post('/postProducts', postProducts);
router.get('/getProducts', getProducts);
router.put('/updateProducts', updateProducts);
router.delete('/deleteProducts/:id', deleteProducts);

export default router