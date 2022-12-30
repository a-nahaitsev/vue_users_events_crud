import express from 'express';
import * as eventController from '../controllers/events.js';

export const router = express.Router();

router.get('/:userId', eventController.getAll);
router.get('/:userId/:eventId', eventController.getOne);
router.post('/:userId', eventController.add);
router.patch('/:userId/:eventId', eventController.update);
router.delete('/:userId/:eventId', eventController.remove);
