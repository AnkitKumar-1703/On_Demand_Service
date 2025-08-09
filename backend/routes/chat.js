import express from 'express';
import { getChatByTaskId, updateChat ,} from '../controller/chatController.js';
const router = express.Router();


router.get('/:taskId',getChatByTaskId);
router.post('/', updateChat);

export default router;