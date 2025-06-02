import { z } from "zod";

export const schoolCodeSchema = z.object({
  schoolCode: z.string().min(1, "School code is required"),
});

export type SchoolCodeFormData = z.infer<typeof schoolCodeSchema>;
