/**
 @author Nikhil Kumar
 @date    28/06/2020
*/

import { Router } from 'express';

const router = Router();

import { postBook, getBooks, getBookByISBN, updateBook, deleteBook } from './book.controller';
router.post('/postBook', postBook);
router.get('/getBooks', getBooks)
router.get('/getBook/:isbn', getBookByISBN)
router.put('/updateBook', updateBook);
router.delete('/deleteBook/:isbn', deleteBook);
export default router