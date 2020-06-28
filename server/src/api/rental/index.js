/**
 @author Nikhil Kumar
 @date    28/06/2020
*/

import { Router } from 'express';

const router = Router();

import { issueBook, returnBook, getBookHistory, getBooksByLoanOrNot } from './rental.controller';
router.post('/issueBook', issueBook);
router.put('/returnBook', returnBook);
router.get('/getBookHistory', getBookHistory)
router.get('/getBooksByLoanOrNot/:isIssuedStatus', getBooksByLoanOrNot)
export default router