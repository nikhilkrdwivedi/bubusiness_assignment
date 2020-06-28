/**
 @author Nikhil Kumar
 @date    01/06/2020
*/


import { Router } from 'express';

const router = Router();

import {  getInventory } from './inventory.controller';
router.get('/getInventory', getInventory);
export default router