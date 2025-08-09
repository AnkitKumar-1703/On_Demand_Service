import express from 'express';
import { customerSignup } from '../controller/customerSignup.js';
import { customerSignIn } from '../controller/customerSignin.js';
import customerAuth from '../controller/customerAuth.js';
const router = express.Router();

router.use('/auth',customerAuth);
router.post('/signup',customerSignup);
router.post('/signin',customerSignIn);

export default router;