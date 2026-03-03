import type { Status } from '../types/status.types';

export const tenantStatus: Status[] = [
  { id: '1', name: 'Requested' },
  { id: '2', name: 'Scheduled' },
  { id: '3', name: 'Visited' },
  { id: '4', name: 'Decision' },
];

export const ownerPropertyStatus: Status[] = [
  { id: '1', name: 'Available' },
  { id: '2', name: 'Under Contract' },
  { id: '3', name: 'Sold' },
];

export const propertyStatus: Status[] = [
  { id: '1', name: 'Draft' },
  { id: '2', name: 'Review' },
  { id: '3', name: 'Published' },
];
