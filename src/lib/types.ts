

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

export interface Owner {
  id: string;
  ownerName: string;
  contactFirstName?: string;
  contactLastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}
