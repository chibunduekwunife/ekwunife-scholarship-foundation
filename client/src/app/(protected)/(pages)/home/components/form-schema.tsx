import { z } from "zod"

// Removed unused normalizePhone helper (inlined logic in superRefine)

export const formSchema = z.object({
  // Step 1 - Personal Information (matches backend)
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  age: z.union([
    z.string(),
    z.number()
  ]).transform((val) => {
    if (typeof val === 'string') {
      if (val === '') return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }).refine((val) => val !== undefined && val >= 15, { message: "Age is required and must be at least 15 years old" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  village: z.string().min(1, { message: "Village is required" }),
  phone_country: z.enum(['NG','US','CA']).default('NG'),
  phone_number: z.string(), // normalize later
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
    .refine((v)=> v.trim().split(/\s+/).filter(Boolean).length >= 100, {
      message: "Essay must be at least 100 words.",
    })
    .refine((v)=> v.trim().split(/\s+/).filter(Boolean).length <= 500, {
      message: "Essay must not exceed 500 words.",
    }),
  referral_source: z.string().min(1, { message: "Referral source is required" }),
  referral_source_confirmed: z.boolean().default(false),
  
  // Application metadata
  scholarship: z.number().optional(), // Will be set based on scholarship type
  status: z.string().default("draft"), // draft, pending, approved, rejected
}).superRefine((data, ctx) => {
  const country = data.phone_country;
  const original = data.phone_number || "";
  const digits = original.replace(/\D/g, "");
  let normalized = original;
  if (country === 'NG') {
    if (digits.startsWith('234')) normalized = '+234' + digits.slice(3, 13);
    else if (digits.startsWith('0')) normalized = '+234' + digits.slice(1, 11);
    else if (digits.length === 10) normalized = '+234' + digits;
  } else if (country === 'US' || country === 'CA') {
    if (digits.startsWith('1')) normalized = '+1' + digits.slice(1, 11);
    else if (digits.length === 10) normalized = '+1' + digits;
  }
  data.phone_number = normalized;
  if (!/^\+(234|1)\d{10}$/.test(data.phone_number)) {
    ctx.addIssue({
      path: ['phone_number'],
      code: z.ZodIssueCode.custom,
      message: 'Enter a valid phone number.'
    });
  }
});

// Type for form data
export type ApplicationFormData = z.infer<typeof formSchema>;

// Partial schema for saving drafts (all fields optional except required ones)
export const draftSchema = z.object({
  full_name: z.string().optional(),
  age: z.union([z.string(), z.number()]).optional(),
  gender: z.string().optional(),
  village: z.string().optional(),
  phone_country: z.enum(['NG','US','CA']).optional(),
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