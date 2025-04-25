import { z } from "zod";

export const schoolCodeSchema = z.object({
  schoolCode: z
    .string()
    .min(3, "School code must be at least 3 characters")
    .regex(/^[A-Z0-9]+$/, "School code must be uppercase letters and numbers"),
});

export type SchoolCodeFormData = z.infer<typeof schoolCodeSchema>;
