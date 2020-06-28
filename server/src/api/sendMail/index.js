
/**
 @author Nikhil Kumar
 @date    20/03/2030
*/


import { Router } from 'express';

const router = Router();

import { sendMail} from './test.get.controller';
router.get('/sendMail',sendMail)
export default router