import { z } from "zod"

export const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Fullname must be at least 2 characters.",
  }),
  age: z.number().min(1, { message: "Age is required" }),
  //   age: z.preprocess(
  //     (val) => Number(val),
  //     z.number().min(15, {
  //       message: "This application only accepts applicants over the age of 15",
  //     })
  //   ),
  gender: z.string().optional(),
  village: z.string().optional(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be at most 15 digits." })
    .regex(/^(\+234|0)[0-9]{10}$/, {
      message: "Enter a valid Nigerian phone number.",
    }),
  address: z.string().min(1, { message: "Address is required." }),
  category: z
    .array(z.string())
    .min(1, { message: "Select at least one category" }),
  secondary_school: z
    .string()
    .min(1, { message: "Secondary school attended is required" }),
  year_of_ssce: z
    .array(z.string())
    .min(1, { message: "Select the year of SSCE/JAMB" }),
  grades: z.array(z.string()).min(1, { message: "Select a subject" }),
  result_documents: z.instanceof(File, {
    message: "Result document required ",
  }),
  passport_photo: z.instanceof(File, {
    message: "Passport document required ",
  }),
  essay: z
    .string()
    .refine((val) => val.trim().split(/\s+/).filter(Boolean).length >= 100, {
      message: "Essay must be at least 100 words.",
    })
    .refine((val) => val.trim().split(/\s+/).filter(Boolean).length <= 500, {
      message: "Essay must not exceed 500 words.",
    }),
  referral_source: z.string().min(1, { message: "Referral is required" }),
});