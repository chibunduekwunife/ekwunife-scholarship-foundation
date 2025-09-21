"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getApplication, type Application } from "../../../services/application-service";
import { ApplicationFormData } from "../../../components/form-schema";
import MultiStepForm from "../../../components/multi-step-form";
import { toast } from "sonner";

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const id = Number(params.id);
        if (isNaN(id)) {
          toast.error("Invalid application ID");
          router.push("/home");
          return;
        }

        const app = await getApplication(id);
        setApplication(app);
      } catch (error) {
        console.error("Failed to fetch application:", error);
        toast.error("Failed to load application");
        router.push("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
        <p className="text-gray-600 mb-6">The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.</p>
        <Button onClick={() => router.push("/home")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/home/application/view/${application.id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to View
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Edit Application</h1>
          <p className="text-gray-600">Make changes to your scholarship application</p>
        </div>
      </div>

      <div className="border-b"></div>

      {/* Edit Form */}
      <div>
        {(() => {
          // Convert Application to ApplicationFormData format
          const applicationFormData: ApplicationFormData & { id: number } = {
            id: application.id,
            full_name: application.full_name,
            age: application.age,
            gender: application.gender,
            village: application.village,
            phone_number: application.phone_number,
            residential_address: application.residential_address,
            scholarship_type: application.scholarship_type,
            school: application.school,
            graduation_year: application.graduation_year,
            grades: Array.isArray(application.grades) ? application.grades : [],
            transcript_documents: undefined, // Files need special handling
            passport_photo: undefined, // Files need special handling
            essay: application.essay,
            referral_source: application.referral_source,
            referral_source_confirmed: application.referral_source_confirmed,
            scholarship: application.scholarship,
            status: application.status,
          };

          return (
            <MultiStepForm 
              scholarshipId={application.scholarship}
              existingApplication={applicationFormData}
            />
          );
        })()}
      </div>
    </div>
  );
}
