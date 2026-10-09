export enum UserRole {
  RESIDENT = 'RESIDENT',
  PROPERTY_OWNER = 'PROPERTY_OWNER',
  MAINTENANCE_STAFF = 'MAINTENANCE_STAFF'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isApproved: boolean;
  approvedByOwnerId?: string;
  assignedPropertyIds?: string[];
  createdAt: number;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  neighbourhood: string;
  city: string;
  rentMin: number;
  rentMax: number;
  roomTypes: string[];
  availableRoomsCount: number;
  amenities: string[];
  safetyFeatures: string[];
  description: string;
  rating: number;
}

export interface StatusUpdate {
  status: TicketStatus;
  updatedByUid: string;
  updatedByName: string;
  timestamp: number;
  note: string;
}

export interface Ticket {
  id: string;
  residentId: string;
  residentName: string;
  residentPhone: string;
  propertyId: string;
  propertyName: string;
  roomNumber: string;
  issueTitle: string;
  category: string;
  priority: TicketPriority;
  description: string;
  status: TicketStatus;
  statusHistory: StatusUpdate[];
  createdAt: number;
  updatedAt: number;
}

export interface Visit {
  id: string;
  residentId: string;
  residentName: string;
  propertyId: string;
  propertyName: string;
  date: string;
  timeSlot: string;
  status: VisitStatus;
  notes: string;
  createdAt: number;
}

export interface Reservation {
  id: string;
  residentId: string;
  residentName: string;
  propertyId: string;
  propertyName: string;
  roomId: string;
  roomNumber: string;
  startDate: string;
  monthlyRent: number;
  deposit: number;
  status: ReservationStatus;
  createdAt: number;
}

export interface MaintenanceStaffMember {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  isApproved: boolean;
  assignedPropertyIds: string[];
  createdAt: number;
}

export interface InventoryItem {
  id: string;
  propertyId: string;
  propertyName: string;
  itemName: string;
  category: string;
  quantity: number;
  minThreshold: number;
  unit: string;
}

export interface Alert {
  id: string;
  propertyId: string;
  propertyName: string;
  title: string;
  severity: string;
  isResolved: boolean;
  createdAt: number;
}
