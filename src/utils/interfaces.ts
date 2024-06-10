export interface RideDetails {
    formattedDate: string;
    _id: number;
    ride_id: string;
    userId: string;
    pickupCoordinates: PickupLocation;
    dropoffCoordinates: DropoffLocation;
    driverCoordinates:driverCoordinates;
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    duration: string;
    model: string;
    price: number;
    status:string;
    date:number;
    feedback:string
    rating:number 
    paymentMode:string   
    ratings:number
    pin:number
}

interface PickupLocation {
    lat: number;
    lng: number;
}

interface DropoffLocation {
    lat: number;
    lng: number;
}
interface driverCoordinates {
    latitude: number;
    longitude: number;
}


export interface DriverInterface {
    name: string;
    email: string;
    mobile: number;
    password: string;
    driverImage: string;
    referral_code: string;
    aadhar: Aadhar;
    location: Location;
    license: License;
    account_status: string;
    identification: boolean;
    vehicle_details: Vehicle;
    joiningDate: Date;
    wallet: {
        balance: number;
        transactions: {
            date: Date;
            details: string;
            amount: number;
            status: string;
        }[];
    };
    RideDetails: {
        completedRides: number;
        cancelledRides: number;
        totalEarnings: number;
    };
    isAvailable: boolean;
    feedbacks: [
        {
            feedback: string;
            rating: number;
        }
    ];
}

interface Aadhar {
    aadharId: string;
    aadharImage: string;
}

interface License {
    licenseId: string;
    licenseImage: string;
}
interface Location {
    longitude: number;
    latitude: number;
}

interface Vehicle {
    registerationID: string;
    model: string;
    rcImageUrl: string;
    carImageUrl: string;
}
export interface Charges {
    standard: number;
    sedan: number;
    suv: number;
    premium: number;
  }
