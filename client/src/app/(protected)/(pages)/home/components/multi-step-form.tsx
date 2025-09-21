"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { formSchema, ApplicationFormData } from "./form-schema";
import { tab_buttons } from "@/app/(protected)/data/scholarship-application";
import clsx from "clsx";
import TabCarousel from "./tab-carousel";
import { 
  createApplication, 
  updateApplication, 
  saveDraftToStorage, 
  loadDraftFromStorage, 
  clearDraftFromStorage 
} from "../services/application-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Scholarship {
  id: number;
  name: string;
  description: string;
}

interface MultiStepFormProps {
  scholarshipId?: number;
  existingApplication?: ApplicationFormData & { id: number }; // For editing existing applications
}

export default function MultiStepForm({ scholarshipId = 1, existingApplication }: MultiStepFormProps) {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      age: "",
      gender: "",
      village: "",
      phone_number: "",
      residential_address: "",
      scholarship_type: "",
      school: "",
      graduation_year: "",
      grades: [],
      transcript_documents: [],
      passport_photo: [],
      essay: "",
      referral_source: "",
      referral_source_confirmed: false,
      scholarship: scholarshipId,
      status: "draft",
    },
  });

  // Fetch scholarships on mount
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await api.get("/api/scholarships/");
        setScholarships(response.data);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
      }
    };

    fetchScholarships();
  }, []);

  // Load draft or existing application on mount
  useEffect(() => {
    if (existingApplication) {
      // Populate form with existing application data
      form.reset(existingApplication);
    } else {
      // Load draft from local storage
      const draft = loadDraftFromStorage();
      if (draft) {
        form.reset({ ...form.getValues(), ...draft });
        toast.success("Draft loaded from previous session");
      }
    }
  }, [existingApplication, form]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = form.getValues();
      saveDraftToStorage(currentData);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [form]);

  // Save and continue function
  const saveAndContinue = async () => {
    setIsSaving(true);
    try {
      const currentData = form.getValues();
      saveDraftToStorage(currentData);
      toast.success("Progress saved!");
      
      // Move to next tab
      const currentIndex = tab_buttons.findIndex(tab => tab.value === currentTab);
      if (currentIndex < tab_buttons.length - 1) {
        setCurrentTab(tab_buttons[currentIndex + 1].value);
      }
    } catch {
      toast.error("Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  };

  // Submit application
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors([]);
    
    // Trigger validation on all fields
    const isValid = await form.trigger();
    
    if (!isValid) {
      // Get all form errors
      const errors = form.formState.errors;
      const errorMessages: string[] = [];
      
      // Map field names to user-friendly names and their step locations
      const fieldToStepMapping: Record<string, {stepName: string, fieldName: string}> = {
        full_name: { stepName: "Personal Information", fieldName: "Full Name" },
        age: { stepName: "Personal Information", fieldName: "Age" },
        gender: { stepName: "Personal Information", fieldName: "Gender" },
        village: { stepName: "Personal Information", fieldName: "Village or Town" },
        phone_number: { stepName: "Personal Information", fieldName: "Phone Number" },
        residential_address: { stepName: "Personal Information", fieldName: "Residential Address" },
        scholarship_type: { stepName: "Academic Background", fieldName: "Scholarship" },
        school: { stepName: "Academic Background", fieldName: "School Attended" },
        graduation_year: { stepName: "Academic Background", fieldName: "Graduation Year" },
        essay: { stepName: "Essay", fieldName: "Essay" },
        referral_source: { stepName: "Essay", fieldName: "Referral Source" },
      };
      
      // Collect error messages with step and field information
      Object.keys(errors).forEach(fieldName => {
        const error = errors[fieldName as keyof typeof errors];
        const mapping = fieldToStepMapping[fieldName];
        
        if (error && mapping) {
          const errorMessage = error.message || "This field is required";
          errorMessages.push(`📍 ${mapping.stepName} ➜ ${mapping.fieldName}: ${errorMessage}`);
        }
      });
      
      // Set validation errors to display inline
      setValidationErrors(errorMessages);
      return;
    }
    
    // If validation passes, proceed with submission
    setIsSubmitting(true);
    try {
      const values = form.getValues() as ApplicationFormData;
      values.status = "pending"; // Change status to pending on submit
      
      // Ensure age is a number
      if (typeof values.age === 'string') {
        values.age = parseInt(values.age, 10);
      }
      
      // Set scholarship ID based on scholarship_type dynamically
      const selectedScholarship = scholarships.find(scholarship => 
        scholarship.name === values.scholarship_type
      );
      
      if (selectedScholarship) {
        values.scholarship = selectedScholarship.id;
      } else {
        // Fallback: try to match by name pattern
        if (values.scholarship_type?.includes("SSCE")) {
          const ssceScholarship = scholarships.find(s => s.name.includes("SSCE"));
          values.scholarship = ssceScholarship?.id || scholarshipId;
        } else if (values.scholarship_type?.includes("University")) {
          const universityScholarship = scholarships.find(s => s.name.includes("University"));
          values.scholarship = universityScholarship?.id || scholarshipId;
        } else {
          values.scholarship = scholarshipId; // Use provided scholarshipId as fallback
        }
      }
      
      if (existingApplication) {
        await updateApplication(existingApplication.id, values);
        toast.success("Application updated successfully!");
        router.push(`/home/application/view/${existingApplication.id}`); // Redirect to view page after editing
      } else {
        await createApplication(values);
        toast.success("Application submitted successfully!");
        clearDraftFromStorage(); // Clear draft after successful submission
        router.push("/home"); // Redirect to home page
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const TabContent =
    tab_buttons.find((tab) => tab.value === currentTab)?.content || null;

  const isLastStep = currentTab === tab_buttons[tab_buttons.length - 1].value;

  return (
    <div className="my-15">
      {/* Mobile Carousel for Tab Buttons */}
      <TabCarousel 
        tabs={tab_buttons}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Desktop Layout: Sidebar + Content */}
      <div className="hidden md:grid md:grid-cols-4 gap-10">
        {/* Sidebar for Tab Buttons on Medium+ Screens */}
        <div className="flex flex-col space-y-2">
          {tab_buttons.map((tab) => (
            <Button
              key={tab.id}
              variant={"ghost"}
              onClick={() => setCurrentTab(tab.value)}
              className={clsx(
                "w-full text-left justify-start",
                currentTab === tab.value && "bg-gray-200"
              )}
            >
              {tab.title}
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="col-span-3">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
              {TabContent && <TabContent />}
              
              {/* Validation Errors Display */}
              {validationErrors.length > 0 && isLastStep && (
                <div className="p-4 border border-red-600 bg-red-50 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-red-500 text-lg">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Form Validation Errors
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-none space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                        <p className="mt-3 text-sm text-red-600">
                          Please fix these issues before submitting your application.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                {!isLastStep && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={saveAndContinue}
                    disabled={isSaving}
                    className="w-40"
                  >
                    {isSaving ? "Saving..." : "Save & Continue"}
                  </Button>
                )}
                
                {isLastStep && (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-40"
                  >
                    {isSubmitting 
                      ? (existingApplication ? "Saving..." : "Submitting...") 
                      : (existingApplication ? "Save Changes" : "Submit Application")
                    }
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Mobile Content Area */}
      <div className="md:hidden">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            {TabContent && <TabContent />}
            
            {/* Validation Errors Display */}
            {validationErrors.length > 0 && isLastStep && (
              <div className="p-4 border border-red-600 bg-red-50 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-red-500 text-lg">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Form Validation Errors
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-none space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-red-600">
                        Please fix these issues before submitting your application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Form Actions */}
            <div className="flex flex-col gap-4 pt-6">
              {!isLastStep && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={saveAndContinue}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Save & Continue"}
                </Button>
              )}
              
              {isLastStep && (
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting 
                    ? (existingApplication ? "Saving..." : "Submitting...") 
                    : (existingApplication ? "Save Changes" : "Submit Application")
                  }
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
