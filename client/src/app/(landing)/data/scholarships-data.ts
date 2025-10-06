import type { ScholarshipPageFormat } from "../types/page-format.types";

export const SSCE_data: ScholarshipPageFormat = {
  scholarshipDescription: {
    heading: "Scholarship Description",
    subheading: "Merit-based prizes will be awarded to the best-performing students from Ekwulobia:",
    items: [
      "Awards will be given to the top 7 students from Ekwulobia",
      "Additional recognition will be given to the top 3 students from Umuchi village"
    ],
    note: "Candidates must upload their official Documents",
  },
  eligibilityCriteria: {
    heading: "Eligibility Criteria",
    subheading: "For SSCE/JAMB Applicants:",
    items: [
      "Must be from Ekwulobia (Anambra State)",
      "Completed WAEC/NECO in 2025 with at least 5 distinctions (A1–B3)",
      "Scored 280 or above in the 2025 JAMB examination"
    ]
  },
  requiredDocuments: {
    heading: "Required Documents",
    subheading: "SSCE/JAMB Category:",
    items: [
      "Scanned copy of 2025 WAEC/NECO result",
      "Scanned copy of 2025 JAMB result",
      "Passport photograph",
      "Short essay (100–150 words): “Why I Deserve This Scholarship”",
      "Contact info: email & phone number"
    ]
  },
  applicationDeadline: {
    heading: "Application Deadline",
    subheading: "Saturday, October 11, 2025 (11:59 PM Nigerian Time)",
  }
};

export const BGUS_data: ScholarshipPageFormat = {
  scholarshipDescription: {
    heading: "Scholarship Description",
    subheading: "In recognition of academic consistency and excellence scholarship prizes will be awarded to select best graduating secondary school and university students each year",
    note: "Candidates must upload their official university certificate and transcript for evaluation."
  },
  eligibilityCriteria: {
    heading: "Eligibility Criteria",
    subheading: "For Graduating University Applicants:",
    items: [
      "Must be from Ekwulobia",
      "Graduated from a Nigerian university in the 2024/2025 academic year",
      "Must submit official certificate and transcript showing a minimum of Second Class Upper (2:1)"
    ]
  },
  requiredDocuments: {
    heading: "Required Documents",
    subheading: "University Graduate Category:",
    items: [
      "Passport photograph",
      "Official certificate of graduation",
      "Official university transcript",
      "Contact info: email & phone number",
      "Optional statement: 'My Academic Journey' (100–200 words)"
    ]
  },
  applicationDeadline: {
    heading: "Application Deadline",
    subheading: "Saturday, October 11, 2025 (11:59 PM Nigerian Time)",
  }
};