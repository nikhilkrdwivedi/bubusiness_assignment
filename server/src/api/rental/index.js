/**
 @author Nikhil Kumar
 @date    28/06/2020
*/

import { Router } from 'express';

const router = Router();

import { issueBook, returnBook /*, getRentBooksList, getRentBookByFilter*/ } from './rental.controller';
router.post('/issueBook', issueBook);
router.put('/returnBook', returnBook);
// router.get('/getBooks', getBooks)
// router.get('/getBook/:isbn', getBookByISBN)
// router.put('/updateBook', updateBook);
// router.delete('/deleteBook/:isbn', deleteBook);
export default router