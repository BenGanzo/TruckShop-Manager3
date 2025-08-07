import type { FieldValue } from 'firebase-admin/firestore';

export interface Asset {
    id: string;
    isActive: boolean;
    vin: string;
    make: string;
    model: string;
    makeYear: string;
    plateNumber: string;
    trailerType: string; // This will be empty for trucks
    purchasedOn: string;
    tagExpireOn: string;
    inspectionDueOn: string;
}

export interface Truck {
    id: string;
    status: string;
    make?: string;
    model?: string;
    engineMake?: string;
    engineModel?: string;
    engineSerial?: string;
    type?: string;
    vin?: string;
    year?: number;
    titleNumber?: string;
    plateNumber?: string;
    state?: string;
    inServiceOn?: Date;
    tagExpireOn?: Date;
    inspectionDueOn?: Date;
    purchasePrice?: number;
    ownedBy?: string;
    lessor?: string;
    insuranceCoverage?: boolean;
    transmission?: string;
    color?: string;
    speedLimit?: number;
    frontTireSize?: string;
    rearTireSize?: string;
    height?: string;
    emptyWeight?: number;
    grossWeight?: number;
    tankCapacity?: number;
    initialMileage?: number;
    averageMpg?: number;
    axles?: number;
    dashCamera?: boolean;
    apu?: boolean;
    pedalCoach?: boolean;
    laneDeparture?: boolean;
    tireChains?: boolean;
    vSpoilers?: boolean;
    adaptiveCruise?: boolean;
    inverter?: boolean;
    hasPets?: boolean;
    flowBelow?: boolean;
    refrigerator?: boolean;
    bunkHeater?: boolean;
    isActive?: boolean;
    ownerId?: string;
}

export interface Trailer {
    id: string;
    isActive: boolean;
    trailerType?: string;
    make?: string;
    makeYear?: string;
    model?: string;
    vin?: string;
    plateNumber?: string;
    state?: string;
    ownerId?: string;
}


export interface Owner {
  id: string;
  ownerName: string;
  contactFirstName?: string;
  contactLastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  updatedAt?: any;
}

export interface WorkOrder {
  id: string;
  numericId: number;
  vehicleId: string;
  mechanicId: string;
  problemDescription: string;
  status: string;
  arrivalDate?: Date;
  departureDate?: Date;
  currentMileage?: number;
  nextServiceDate?: Date;
  nextServiceMiles?: number;
  parts?: any[]; // Replace 'any' with a 'Part' interface later
  labor?: any[]; // Replace 'any' with a 'Labor' interface later
  taxRate?: number;
  total?: number
  createdAt:Date | FieldValue; 
  updatedAt?:Date | FieldValue;
}

export interface CatalogPart {
    id: string;
    partId: string;
    name: string;
    quantity: number;
    cost: number;
    isTaxable?: boolean;
    type: 'part';
}

export interface CatalogLabor {
    id: string;
    description: string;
    defaultHours: number;
    defaultRate: number;
    hasPmRule: boolean;
    pmIntervalMiles?: number;
    pmIntervalDays?: number;
    kit?: { partId: string; quantity: number }[];
    type: 'labor';
}

export interface Supplier {
  id: string;
  name: string;
  contactFirstName?: string;
  contactLastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface PurchaseOrder {
    id: string;
    numericId: number;
    supplierId: string;
    supplierName: string;
    status: 'draft' | 'ordered' | 'completed' | 'cancelled';
    issueDate: Date;
    expectedDeliveryDate?: Date;
    items: {
        partId: string;
        name: string;
        quantity: number;
        cost: number;
    }[];
    shippingCost: number;
    taxRate: number;
    total: number;
    createdAt: any;
    updatedAt?: any;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: any;
    updatedAt?: any;
}
