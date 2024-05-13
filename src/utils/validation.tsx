import * as yup from "yup";

export const signupValidation = yup.object({
  name: yup
    .string()
    .min(3, "Type a valid name")
    .required("Please enter a name"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  mobile: yup
    .string()
    .length(10, "Please enter a valid number")
    .required("Please enter an email"),
  password: yup
    .string()
    .matches(/^(?=.*[A-Z])/, "Must include One uppercase letter")
    .matches(/^(?=.*\d)/, "Must include one digit")
    .required("Passowrd is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .required("Please re-enter the password"),
  reffered_Code: yup
    .string()
    .min(5, "Enter a valid code")
    .matches(/^(?=.*\d)/, "Enter a valid code"),
});
