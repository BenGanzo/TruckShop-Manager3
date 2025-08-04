
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
