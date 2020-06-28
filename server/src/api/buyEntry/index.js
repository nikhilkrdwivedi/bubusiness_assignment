/**
 @author Nikhil Kumar
 @date    01/06/2020
*/


import { Router } from 'express';

const router = Router();

import { postBuyEntry, getBuyEntry, updateBuyEntry, deleteBuyEntry } from './buyEntry.controller';
router.post('/postBuyEntry', postBuyEntry);
router.get('/getBuyEntry', getBuyEntry)
router.put('/updateBuyEntry', updateBuyEntry);
router.delete('/deleteBuyEntry/:id', deleteBuyEntry);
export default router