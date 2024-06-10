import { ChangeEvent } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleModelSelection = (e: ChangeEvent<HTMLInputElement>,formik:any,charges:any) => {
    switch (e.target.value) {
      case "Standard":
        formik.setFieldValue("vehicleModel", "Standard");
        formik.setFieldValue("price", charges.standard);
        break;
      case "SUV":
        formik.setFieldValue("vehicleModel", "SUV");
        formik.setFieldValue("price", charges.suv);
        break;
      case "Premium":
        formik.setFieldValue("vehicleModel", "Premium");
        formik.setFieldValue("price", charges.premium);
        break;
      case "Sedan":
        formik.setFieldValue("vehicleModel", "Sedan");
        formik.setFieldValue("price", charges.sedan);
        break;
    }
  };