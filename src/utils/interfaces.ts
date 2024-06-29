export interface RideDetails {
    formattedDate: string;
    _id: number;
    ride_id: string;
    driver_id:string;
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
    ratings: string;
    _id:string;
    name: string;
    email: string;
    mobile: string;
    password: string;
    driverImage: string;
    referral_code: string;
    aadhar: Aadhar;
    location: Location;
    license: License;
    account_status: string;
    identification: boolean;
    vehicle_details: Vehicle;
    joiningDate: string;
    formattedDate: string;
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



export interface UserInterface extends Document {
    _id:string;
    name: string;
    email: string;
    formattedDate: string;
    mobile: string;
    referralCode:string;
    password: string;
    userImage: string;
    referral_code: string;
    account_status: string;
    accountStatus:string;
    joiningDate: string;
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
    };
}

