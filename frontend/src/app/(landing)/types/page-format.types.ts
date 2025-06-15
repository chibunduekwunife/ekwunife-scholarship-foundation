export type ScholarshipPageSection = {
heading: string;
  subheading: string;
  items?: string[];
  note?: string;
};

export type ScholarshipPageFormat = {
  scholarshipDescription: ScholarshipPageSection;
  eligibilityCriteria: ScholarshipPageSection;
  requiredDocuments: ScholarshipPageSection;
  applicationDeadline: ScholarshipPageSection;
  // Add more categories as needed
};
