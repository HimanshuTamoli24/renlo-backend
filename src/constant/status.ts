import type { Status } from '../types/status.types';

export const tenantStatus: Status[] = [
  { name: 'Requested' },
  { name: 'Scheduled' },
  { name: 'Visited' },
  { name: 'Decision' },
];

export const propertyStatus: Status[] = [
  { name: 'Available' },
  { name: 'Under Contract' },
  { name: 'Sold' },
];

export const ownerPropertyStatus: Status[] = [
  { name: 'Draft' },
  { name: 'Review' },
  { name: 'Published' },
];
