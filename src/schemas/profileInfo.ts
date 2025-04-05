import { phoneRegex } from "@/utils/phoneRegex";
import { z } from "zod";

export const firstNameSchema = z.string({
  required_error: "First name is required",
});
export const lastNameSchema = z.string({
  required_error: "Last name is required",
});
export const emailSchema = z
  .string({ required_error: "Email is required" })
  .email({ message: "Email is not valid" });
export const phoneNumberSchema = z
  .string()
  .regex(phoneRegex, "Phone number is not valid");
