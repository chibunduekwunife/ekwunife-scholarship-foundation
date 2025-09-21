import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface Scholarship {
  id: number;
  name: string;
  description: string;
}

export default function Step2() {
  const { control } = useFormContext();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await api.get("/api/scholarships/");
        setScholarships(response.data);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  return (
    <div className="flex flex-col gap-7 max-w-lg my-4">
      <FormField
        control={control}
        name="scholarship_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scholarship <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading scholarships..." : "Select scholarship"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {scholarships.map((scholarship) => (
                  <SelectItem key={scholarship.id} value={scholarship.name}>
                    {scholarship.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="school"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School attended <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter your school name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="graduation_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Graduation Year <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input 
                placeholder="2023" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="transcript_documents"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Upload Transcript Documents</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  // Exclude value prop for file inputs to avoid React warnings
                  {...field}
                />
                {value && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-green-700 font-medium">
                      {value.name}
                    </span>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="passport_photo"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Upload Passport Photo</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input 
                  type="file" 
                  accept=".jpg,.jpeg,.png"
                  className="cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  // Exclude value prop for file inputs to avoid React warnings
                  {...field}
                />
                {value && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-green-700 font-medium">
                      {value.name}
                    </span>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
