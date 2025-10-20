import { Router } from 'express';
import { DonationController } from '../controllers/donation.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/', authenticate, asyncHandler(DonationController.create));
router.get('/', authenticate, asyncHandler(DonationController.getUserDonations));
router.get('/:id', authenticate, asyncHandler(DonationController.getById));

export default router;
