"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApplications, deleteApplication, type Application } from "../services/application-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Eye } from "lucide-react";

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const apps = await getApplications();
      setApplications(apps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      
      // Check if it's an authentication error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          // Optionally redirect to login page
          // router.push('/auth');
        } else {
          toast.error("Failed to fetch applications");
        }
      } else {
        toast.error("Failed to fetch applications");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
        toast.success("Application deleted successfully");
        fetchApplications(); // Refresh the list
      } catch {
        toast.error("Failed to delete application");
      }
    }
  };

  const handleEdit = (application: Application) => {
    // Navigate to form with application data
    router.push(`/home/application/edit/${application.id}`);
  };

  const handleView = (application: Application) => {
    // Navigate to view page
    router.push(`/home/application/view/${application.id}`);
  };

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

  if (loading) {
    return (
      <div className="my-15">
        <h1 className="text-xl font-semibold mb-5">My Applications</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-15">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            My Scholarship Applications ({applications.length})
          </h1>
          <Button 
            onClick={() => router.push("/home/new-application")}
            className="bg-primary"
          >
            New Application
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You have not applied to any scholarships yet</p>
            <Button 
              onClick={() => router.push("/home/new-application")}
              variant="outline"
            >
              Start Your First Application
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-primary text-lg">
                        {application.full_name}
                      </CardTitle>
                      <CardDescription>
                        {application.school} • {application.scholarship_type}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Village:</strong> {application.village}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Submitted:</strong> {new Date(application.submitted_at).toLocaleDateString()}
                    </p>
                    {application.essay && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <strong>Essay:</strong> {application.essay.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(application)}
                      className="flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </Button>
                    
                    {application.status === "draft" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(application)}
                        className="flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(application.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
