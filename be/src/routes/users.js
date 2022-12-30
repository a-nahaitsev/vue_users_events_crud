import express from 'express';
import * as userController from '../controllers/users.js';

export const router = express.Router();

router.get('/', userController.getAll);
router.get('/:userId', userController.getOne);
router.post('/', userController.add);
router.patch('/:userId', userController.update);
router.delete('/:userId', userController.remove);
