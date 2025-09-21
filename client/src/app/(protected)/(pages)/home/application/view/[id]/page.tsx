"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, User, GraduationCap, PenTool } from "lucide-react";
import { getApplication, type Application } from "../../../services/application-service";
import { toast } from "sonner";

export default function ViewApplicationPage() {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-500";
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleEdit = () => {
    router.push(`/home/application/edit/${application?.id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
        <p className="text-gray-600 mb-6">The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/home")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Application Details</h1>
            <p className="text-gray-600">Submitted on {new Date(application.submitted_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(application.status)} text-white`}>
            {getStatusText(application.status)}
          </Badge>
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Application
          </Button>
        </div>
      </div>

      <div className="border-b"></div>

      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-lg font-semibold">{application.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Age</label>
              <p className="text-lg">{application.age} years old</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-lg">{application.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Village</label>
              <p className="text-lg">{application.village}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <p className="text-lg">{application.phone_number}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Residential Address</label>
              <p className="text-lg">{application.residential_address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Background Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-5 w-5" />
            Academic Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Scholarship Type</label>
              <p className="text-lg font-semibold">{application.scholarship_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">School Attended</label>
              <p className="text-lg">{application.school}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Graduation Year</label>
              <p className="text-lg">{application.graduation_year}</p>
            </div>
            {application.grades && application.grades.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600">Grades</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {application.grades.map((grade, index) => (
                    <Badge key={index} variant="outline">{grade}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {application.transcript_documents && (
              <div>
                <label className="text-sm font-medium text-gray-600">Transcript Documents</label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Document uploaded</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(application.transcript_documents, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}
            {application.passport_photo && (
              <div>
                <label className="text-sm font-medium text-gray-600">Passport Photo</label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Photo uploaded</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(application.passport_photo, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Essay Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <PenTool className="h-5 w-5" />
            Essay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{application.essay}</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {application.referral_source && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium text-gray-600">How did you hear about this scholarship?</label>
              <p className="text-lg mt-1">{application.referral_source}</p>
            </div>
            {application.referral_source_confirmed && (
              <div className="mt-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Referral source confirmed
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
