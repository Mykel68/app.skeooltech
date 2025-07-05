import { z } from "zod";

/**
 * Zod schema for user registration.
 */
export const registrationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be at most 30 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["Student", "Teacher", "Parent"], {
    required_error: "Role is required",
  }),
  first_name: z
    .string()
    .max(50, { message: "First name must be at most 50 characters" })
    .optional(),
  last_name: z
    .string()
    .max(50, { message: "Last name must be at most 50 characters" })
    .optional(),
  class_id: z.string().optional(),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
