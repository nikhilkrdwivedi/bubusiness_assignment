/**
 @author Nikhil Kumar
 @date    20/03/2020
*/


import { Router } from 'express';

const router = Router();

import { postSaleEntry, getSaleEntry, updateSaleEntry, deleteSaleEntry,getTodaySaleDetail,getSaleEntries } from './saleEntry.controller';
router.post('/postSaleEntry', postSaleEntry);
router.get('/getSaleEntry', getSaleEntry);
router.get('/getTodaySaleDetail', getTodaySaleDetail);
router.put('/updateSaleEntry', updateSaleEntry);
router.delete('/deleteSaleEntry/:id', deleteSaleEntry);
router.get('/getSaleEntries', getSaleEntries);
export default router