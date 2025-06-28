import { z } from "zod"

export const formSchema = z.object({
  // Step 1 - Personal Information (matches backend)
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  age: z.number().min(15, { message: "Must be at least 15 years old" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  village: z.string().min(1, { message: "Village is required" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be at most 15 digits." })
    .regex(/^(\+234|0)[0-9]{10}$/, {
      message: "Enter a valid Nigerian phone number.",
    }),
  residential_address: z.string().min(1, { message: "Address is required." }),
  
  // Step 2 - Educational Information (matches backend)
  scholarship_type: z
    .string()
    .min(1, { message: "Please select a scholarship" }),
  school: z
    .string()
    .min(1, { message: "School attended is required" }),
  graduation_year: z
    .string()
    .min(1, { message: "Graduation year is required" }),
  grades: z.array(z.string()).default([]),
  transcript_documents: z.instanceof(File).optional(),
  passport_photo: z.instanceof(File).optional(),
  
  // Step 3 - Essay and Referral (matches backend)
  essay: z
    .string()
    .refine((val) => val.trim().split(/\s+/).filter(Boolean).length >= 100, {
      message: "Essay must be at least 100 words.",
    })
    .refine((val) => val.trim().split(/\s+/).filter(Boolean).length <= 500, {
      message: "Essay must not exceed 500 words.",
    }),
  referral_source: z.string().min(1, { message: "Referral source is required" }),
  referral_source_confirmed: z.boolean().default(false),
  
  // Application metadata
  scholarship: z.number().optional(), // Will be set based on scholarship type
  status: z.string().default("draft"), // draft, pending, approved, rejected
});

// Type for form data
export type ApplicationFormData = z.infer<typeof formSchema>;

// Partial schema for saving drafts (all fields optional except required ones)
export const draftSchema = z.object({
  full_name: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  village: z.string().optional(),
  phone_number: z.string().optional(),
  residential_address: z.string().optional(),
  scholarship_type: z.string().optional(),
  school: z.string().optional(),
  graduation_year: z.string().optional(),
  grades: z.array(z.string()).default([]),
  transcript_documents: z.instanceof(File).optional(),
  passport_photo: z.instanceof(File).optional(),
  essay: z.string().optional(),
  referral_source: z.string().optional(),
  referral_source_confirmed: z.boolean().default(false),
  scholarship: z.number().optional(),
  status: z.string().default("draft"),
});

export type ApplicationDraftData = z.infer<typeof draftSchema>;