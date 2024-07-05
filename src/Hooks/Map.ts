import { toast } from "react-toastify";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const reverseGeocodeForAddress = async (latitude: number, longitude: number) => {
  try {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);

    return new Promise<string>((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const addressComponents = results[0].address_components;
          let address = "";

          for (const component of addressComponents) {
            if (component.types.includes("route")) {
              address += component.long_name + ", ";
            }
            if (component.types.includes("neighborhood")) {
              address += component.long_name + ", ";
            }
            if (component.types.includes("sublocality_level_3")) {
              address += component.long_name + ", ";
            }
            if (component.types.includes("sublocality_level_2")) {
              address += component.long_name + ", ";
            }
            if (component.types.includes("sublocality_level_1")) {
              address += component.long_name + ", ";
            }
            if (component.types.includes("locality")) {
              address += component.long_name + ", ";
            }
            if (component.types.includes("administrative_area_level_1")) {
              address += component.long_name + ", ";
            }
            if (component.types.includes("country")) {
              address += component.long_name;
            }
          }

          // Remove trailing commas and spaces
          address = address.replace(/,\s*$/, "");

          console.log("Geocoded address:", address);
          resolve(address);
        } else {
          console.error("Geocoding failed:", status, results);
          reject("Getting location failed");
        }
      });
    });
  } catch (error: any) {
    console.error("Geocoding error:", error);
    return error.message;
  }
};


export const reverseGeocodeForLocality = async (latitude: any, longitude: any) => {
    try {            
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(latitude, longitude);

        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === "OK" && results?.[0]) {
                    const addressComponents = results[0].address_components;
                    let locality = "";

                    for (const component of addressComponents) {
                        if (component.types.includes("route")) {
                            locality += component.long_name + ", ";
                        }
                        if (component.types.includes("neighborhood")) {
                            locality += component.long_name + ", ";
                        }
                        if (component.types.includes("sublocality_level_3")) {
                            locality += component.long_name + ", ";
                        }
                        if (component.types.includes("sublocality_level_2")) {
                            locality += component.long_name + ", ";
                        }
                        if (component.types.includes("sublocality_level_1")) {
                            locality += component.long_name;
                        }
                    }
                    resolve(locality);
                } else {
                    reject("Getting location failed");
                }
            });
        });
    } catch (error: any) {
        return error.message;
    }
};




export  const geocoeLocation = async (locationName: string) => {
    try {
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: locationName }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const location = results?.[0].geometry.location;
            const latitude = location.lat();
            const longitude = location.lng();
            resolve({ latitude, longitude });
          } else {
            reject("Google failed");
          }
        });
      });
    } catch (error: any) {
      return error.message;
    }
  };


  export const generateRandomString = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    let randomString = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      randomString += digits[randomIndex];
    }

    return randomString;
  };

  export const toLocation = (destinationRef:any,setDropoffLocation:any,setcenter:any,setzoom:any,center:any,map:any) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const locationDetails = await reverseGeocodeForAddress(latitude, longitude);
          if (destinationRef.current) {
            destinationRef.current.value = locationDetails;
            setDropoffLocation(locationDetails);
          }
          setcenter({ lat: latitude, lng: longitude });
          map?.panTo(center);
          setzoom(16);
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };


  export  const fromLocation = async (setPickupLocation:any,setcenter:any,center:any,map:any,originRef:any,setzoom:any) => {
    console.log("dfsbsdbshd");
    console.log(navigator.geolocation,"from location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationDetails: string = await reverseGeocodeForAddress(
            latitude,
            longitude
          );
          if (originRef.current) {
            originRef.current.value = locationDetails;
            setPickupLocation(locationDetails);
          }
          setcenter({ lat: latitude, lng: longitude });
          map?.panTo(center);
          setzoom(16);
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };
