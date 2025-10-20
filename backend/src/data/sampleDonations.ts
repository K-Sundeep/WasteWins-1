import { Donation } from '../types/donation';

export const sampleDonations: Donation[] = [
  {
    id: 'sample-donation-1',
    status: 'collected',
    items: 'Warm Clothes Collection',
    weight: 12,
    pointsEarned: 240,
    trackingSteps: [
      { title: 'Collected', completed: true, date: new Date().toISOString() },
      { title: 'In Transit', completed: false },
      { title: 'Processing', completed: false },
    ],
    createdAt: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-donation-2',
    status: 'processing',
    items: 'E-Waste Recycling Batch',
    weight: 5,
    pointsEarned: 150,
    trackingSteps: [
      { title: 'Collected', completed: true, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { title: 'In Transit', completed: true, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { title: 'Processing', completed: true },
      { title: 'Manufactured', completed: false },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedCompletion: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
