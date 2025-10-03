/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Edit, FileText, User, GraduationCap, PenTool } from "lucide-react";
import { getApplication, type Application } from "../../../services/application-service";
import { toast } from "sonner";
import { ACCESS_TOKEN } from "@/lib/constants";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
}
function dlTranscript(appId: number, fileId?: number) {
  return fileId
    ? `${apiBase()}/api/applications/${appId}/transcripts/${fileId}/download/`
    : `${apiBase()}/api/applications/${appId}/transcript/download/`;
}
function dlPassport(appId: number, fileId?: number) {
  return fileId
    ? `${apiBase()}/api/applications/${appId}/passports/${fileId}/download/`
    : `${apiBase()}/api/applications/${appId}/passport/download/`;
}
function withBase(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBase()}/${url.replace(/^\//, '')}`;
}
const isImg = (name: string) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(name);
const isPdf = (name: string) => /\.pdf$/i.test(name);
const baseName = (p: string) => (p?.split('/').pop() || 'file');

// Auth helpers for secure preview/download
function getToken() {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(ACCESS_TOKEN); } catch { return null; }
}
async function fetchBlobWithAuth(url: string) {
  const token = getToken();
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch file');
  const contentType = res.headers.get('Content-Type') || '';
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  return { objectUrl, contentType };
}

export default function ViewApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  // viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewer, setViewer] = useState<{ title: string; url: string; downloadUrl?: string; kind: 'image' | 'pdf' | 'other' } | null>(null);

  // Replace direct open with authenticated preview where possible
  const viewItem = async (title: string, directUrl: string, downloadUrl?: string) => {
    try {
      if (downloadUrl) {
        const { objectUrl, contentType } = await fetchBlobWithAuth(downloadUrl);
        const kind: 'image' | 'pdf' | 'other' = contentType.startsWith('image/') ? 'image' : (contentType.includes('pdf') ? 'pdf' : 'other');
        setViewer({ title, url: objectUrl, downloadUrl, kind });
      } else {
        const name = title.toLowerCase();
        const kind: 'image' | 'pdf' | 'other' = isImg(name) ? 'image' : isPdf(name) ? 'pdf' : 'other';
        setViewer({ title, url: directUrl, downloadUrl, kind });
      }
      setViewerOpen(true);
    } catch {
      console.error('Failed to load preview');
      toast.error('Unable to preview file. You can download it instead.');
      setViewer({ title, url: directUrl, downloadUrl, kind: 'other' });
      setViewerOpen(true);
    }
  };

  const handleDownload = async (url?: string, filename?: string) => {
    if (!url) return;
    try {
      const { objectUrl } = await fetchBlobWithAuth(url);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
    } catch (e) {
      console.error('Download failed, falling back to navigation', e);
      // Fallback: navigate (may require auth session)
      window.location.href = url;
    }
  };

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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left group: back button then title/date (stacked on small, inline on md) */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/home")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Applications
            </Button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Application Details</h1>
            <p className="text-gray-600">Submitted on {new Date(application.submitted_at).toLocaleDateString()}</p>
          </div>
        </div>
        {/* Right group: status + edit (always inline) */}
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
            {/* Result/Certificate documents list */}
            <div>
              <label className="text-sm font-medium text-gray-600">Result/Certificate Documents</label>
              {application?.transcript_files && application.transcript_files.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {application.transcript_files.map((f) => {
                    const name = baseName(f.file);
                    const url = withBase(f.file);
                    return (
                      <li key={f.id} className="flex items-center justify-between gap-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700 truncate" title={name}>{name}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => viewItem(name, url, dlTranscript(application.id, f.id))}>View</Button>
                      </li>
                    );
                  })}
                </ul>
              ) : application?.transcript_documents ? (
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center justify-between gap-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700 truncate" title={application.transcript_documents}>
                        {baseName(application.transcript_documents)}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => viewItem(baseName(application.transcript_documents!), withBase(application.transcript_documents!), dlTranscript(application.id))}>View</Button>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No transcripts uploaded</p>
              )}
            </div>

            {/* Passport photos list */}
            <div>
              <label className="text-sm font-medium text-gray-600">Passport Photos</label>
              {application?.passport_photos && application.passport_photos.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {application.passport_photos.map((p) => {
                    const name = baseName(p.image);
                    const url = withBase(p.image);
                    return (
                      <li key={p.id} className="flex items-center justify-between gap-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700 truncate" title={name}>{name}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => viewItem(name, url, dlPassport(application.id, p.id))}>View</Button>
                      </li>
                    );
                  })}
                </ul>
              ) : application?.passport_photo ? (
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center justify-between gap-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700 truncate" title={application.passport_photo}>
                        {baseName(application.passport_photo)}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => viewItem(baseName(application.passport_photo!), withBase(application.passport_photo!), dlPassport(application.id))}>View</Button>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No passport photos uploaded</p>
              )}
            </div>
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

      {/* File Viewer Modal */}
      <Dialog open={viewerOpen} onOpenChange={(open) => { setViewerOpen(open); }}>
        <DialogContent className="w-[96vw] max-w-[96vw] md:max-w-4xl p-4 md:p-6">
          <DialogHeader className="max-w-full">
            <DialogTitle className="truncate max-w-full pr-8">{viewer?.title || 'Preview'}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {viewer?.kind === 'image' && (
              <div className="w-full flex items-center justify-center overflow-hidden">
                <img src={viewer.url} alt={viewer.title} className="max-w-full max-h-[70vh] h-auto w-auto rounded border" />
              </div>
            )}
            {viewer?.kind === 'pdf' && (
              <iframe src={viewer.url} className="w-full h-[75vh] border rounded" />
            )}
            {viewer?.kind === 'other' && (
              <div className="p-4 text-sm text-gray-700">
                <p>Preview not available for this file type.</p>
                {viewer.downloadUrl && (
                  <p className="mt-2">You can download it instead.</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 flex flex-col sm:flex-row">
            {viewer?.downloadUrl && (
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleDownload(viewer.downloadUrl, viewer.title)}>Download</Button>
            )}
            <Button className="w-full sm:w-auto" onClick={() => setViewerOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
