import api from "@/lib/api";
import { ApplicationFormData, ApplicationDraftData } from "../components/form-schema";
import { ACCESS_TOKEN } from "@/lib/constants";

// Application interface matching backend model
export interface Application {
  id: number;
  scholarship: number;
  reviewer?: number;
  applicant: number;
  full_name: string;
  age: number;
  gender: string;
  village: string;
  phone_number: string;
  residential_address: string;
  scholarship_type: string;
  school: string;
  graduation_year: string;
  grades: string[];
  transcript_documents?: string;
  passport_photo?: string;
  essay: string;
  referral_source: string;
  referral_source_confirmed: boolean;
  submitted_at: string;
  status: string;
  transcript_files?: { id: number; file: string }[];
  passport_photos?: { id: number; image: string }[];
}

// Get all applications for the current user
export const getApplications = async (): Promise<Application[]> => {
  try {
    console.log("Fetching applications...");
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000');
    
    // Check if user has a token
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log("Token available:", !!token);
    console.log("Token (first 20 chars):", token?.substring(0, 20) + "...");
    
    const response = await api.get("/api/applications/");
    console.log("Applications fetched successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching applications:", error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error("Error response:", axiosError.response);
      console.error("Error status:", axiosError.response?.status);
      console.error("Error data:", axiosError.response?.data);
      
      if (axiosError.response?.status === 401) {
        console.error("Authentication error - token might be invalid or expired");
        console.error("Please check if you are logged in properly");
      }
    }
    
    throw error;
  }
};

// Get a single application by ID
export const getApplication = async (id: number): Promise<Application> => {
  try {
    console.log("Fetching application with ID:", id);
    const response = await api.get(`/api/applications/${id}/`);
    console.log("Application fetched successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching application:", error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error("Error response:", axiosError.response);
      console.error("Error status:", axiosError.response?.status);
      console.error("Error data:", axiosError.response?.data);
    }
    
    throw error;
  }
};

// Create a new application
export const createApplication = async (data: ApplicationFormData): Promise<Application> => {
  try {
    console.log("Creating application with data:", data);
    
    const formData = new FormData();
    
    // Add all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'transcript_documents' || key === 'passport_photo') {
        if (Array.isArray(value)) {
          value.forEach(file => {
            if (file && typeof file === 'object' && 'name' in file) {
              formData.append(key, file as File);
            }
          });
        } else if (value && typeof value === 'object' && 'name' in value) {
          formData.append(key, value as File);
        }
      } else if (key === 'grades') {
        console.log(`Adding grades:`, value);
        formData.append(key, JSON.stringify(value));
      } else if (key === 'scholarship') {
        // Ensure scholarship is a valid number, default to 1 if not
        const scholarshipId = value || 4; // Default to SSCE scholarship ID
        console.log(`Adding scholarship:`, scholarshipId);
        formData.append(key, String(scholarshipId));
      } else if (value !== undefined && value !== null) {
        console.log(`Adding ${key}:`, value);
        formData.append(key, String(value));
      }
    });

    // Log what we're sending
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await api.post("/api/applications/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating application:", error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error("Response status:", axiosError.response?.status);
      console.error("Response data:", axiosError.response?.data);
      
      if (axiosError.response?.status === 400) {
        console.error("Bad Request - likely validation error or missing required fields");
      }
    }
    
    throw error;
  }
};

// Update an existing application
export const updateApplication = async (id: number, data: Partial<ApplicationFormData>): Promise<Application> => {
  try {
    console.log("Updating application with ID:", id, "and data:", data);
    
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'transcript_documents' || key === 'passport_photo') {
        if (Array.isArray(value)) {
          value.forEach(file => {
            if (file && typeof file === 'object' && 'name' in file) {
              formData.append(key, file as File);
            }
          });
        } else if (value && typeof value === 'object' && 'name' in value) {
          formData.append(key, value as File);
        }
      } else if (key === 'grades') {
        console.log(`Adding grades:`, value);
        formData.append(key, JSON.stringify(value));
      } else if (key === 'delete_transcript_ids' || key === 'delete_passport_photo_ids') {
        if (Array.isArray(value)) {
          value.forEach((id) => formData.append(key, String(id)));
        }
      } else if (key === 'existing_transcript_files' || key === 'existing_passport_photos') {
        // ignore on transport (read-only), but keep in values for UI
      } else if (key === 'scholarship') {
        // Ensure scholarship is a valid number
        const scholarshipId = value || 4; // Default to SSCE scholarship ID
        console.log(`Adding scholarship:`, scholarshipId);
        formData.append(key, String(scholarshipId));
      } else if (value !== undefined && value !== null) {
        console.log(`Adding ${key}:`, value);
        formData.append(key, String(value));
      }
    });

    // Log what we're sending
    console.log("FormData entries for update:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await api.patch(`/api/applications/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("Application updated successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating application:", error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error("Response status:", axiosError.response?.status);
      console.error("Response data:", axiosError.response?.data);
      
      if (axiosError.response?.status === 400) {
        console.error("Bad Request - likely validation error or missing required fields");
      }
    }
    
    throw error;
  }
};

// Delete an application
export const deleteApplication = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/applications/delete/${id}/`);
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

// Local storage keys for draft management
const DRAFT_STORAGE_KEY = "scholarship_application_draft";

// Persisted file metadata interface
interface PersistedFileMeta { name: string; type: string; size: number; dataUrl: string | null }
interface PersistedFilesWrapper { __files: PersistedFileMeta[] }

// Save draft to local storage
export const saveDraftToStorage = async (data: Partial<ApplicationDraftData>): Promise<void> => {
  try {
    const MAX_FILE_PERSIST = 2 * 1024 * 1024; // 2MB per file safeguard
    const toPersist: Record<string, unknown> = { ...data } as Record<string, unknown>;

    const fileArrayKeys: (keyof Partial<ApplicationDraftData>)[] = ['transcript_documents', 'passport_photo'];

    const fileToDataURL = (file: File): Promise<string | null> => new Promise((resolve) => {
      if (file.size > MAX_FILE_PERSIST) return resolve(null); // skip large files
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

    for (const key of fileArrayKeys) {
      const value = (data as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        const serialized: PersistedFileMeta[] = [];
        for (const f of value) {
          if (f instanceof File) {
            const dataUrl = await fileToDataURL(f);
            serialized.push({ name: f.name, type: f.type, size: f.size, dataUrl });
          }
        }
        if (serialized.length > 0) {
          toPersist[key] = { __files: serialized };
        } else {
          delete toPersist[key];
        }
      } else if (value instanceof File) {
        // legacy single file case (should not happen now)
        const dataUrl = await fileToDataURL(value);
        toPersist[key] = { __files: [{ name: value.name, type: value.type, size: value.size, dataUrl }] };
      } else {
        delete toPersist[key];
      }
    }

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(toPersist));
  } catch (error) {
    console.error("Error saving draft:", error);
  }
};

// Load draft from local storage
export const loadDraftFromStorage = (): Partial<ApplicationDraftData> | null => {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);

    const reconstruct = (entry: unknown): File[] => {
      if (!entry || typeof entry !== 'object' || !('__files' in entry)) return [];
      const filesMeta = (entry as PersistedFilesWrapper).__files || [];
      const files: File[] = [];
      for (const meta of filesMeta) {
        if (!meta || !meta.dataUrl) continue;
        try {
          const dataUrl: string = meta.dataUrl;
          const commaIdx = dataUrl.indexOf(',');
          const base64 = dataUrl.substring(commaIdx + 1);
          const byteChars = atob(base64);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
          const blob = new Blob([new Uint8Array(byteNumbers)], { type: meta.type || 'application/octet-stream' });
          const file = new File([blob], meta.name || 'file', { type: meta.type || 'application/octet-stream' });
          Object.defineProperty(file, 'lastModified', { value: Date.now() });
          files.push(file);
        } catch (e) {
          console.warn('Failed to reconstruct file', e);
        }
      }
      return files;
    };

    const draft: Record<string, unknown> = { ...parsed };
    if (parsed.transcript_documents) draft.transcript_documents = reconstruct(parsed.transcript_documents);
    if (parsed.passport_photo) draft.passport_photo = reconstruct(parsed.passport_photo);

    return draft;
  } catch (error) {
    console.error("Error loading draft:", error);
    return null;
  }
};

// Clear draft from local storage
export const clearDraftFromStorage = (): void => {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
};
