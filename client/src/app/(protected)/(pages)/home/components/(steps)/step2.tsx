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
  const { control, setValue, watch } = useFormContext();
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
        render={({ field: { onChange, value = [], ...field } }) => (
          <FormItem>
            <FormLabel>Upload Transcript Documents</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {/* uploader */}
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md p-6 text-center hover:border-primary/70 transition cursor-pointer bg-muted/30">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length) {
                        onChange([...(value || []), ...files]);
                      }
                      e.target.value = ""; // allow re-upload same file
                    }}
                    {...field}
                  />
                  <span className="text-sm font-medium text-primary">Browse</span>
                  <span className="text-xs text-muted-foreground mt-1">or drag & drop files here</span>
                  <span className="text-[11px] text-muted-foreground mt-2">PDF, DOC, Images</span>
                </label>
                {/* existing items from server */}
                <ExistingFilesList
                  items={watch('existing_transcript_files') || []}
                  onRemove={(id) => {
                    const current = (watch('existing_transcript_files') || []) as { id: number; url: string; name?: string }[];
                    setValue('existing_transcript_files', current.filter((i)=> i.id !== id));
                    const del = (watch('delete_transcript_ids') || []) as number[];
                    setValue('delete_transcript_ids', [...del, id]);
                  }}
                />
                {/* newly selected files list */}
                {Array.isArray(value) && value.length > 0 && (
                  <ul className="space-y-2">
                    {value.map((f: File, idx: number) => (
                      <li key={idx} className="flex items-center justify-between gap-3 rounded-md border bg-white/50 dark:bg-muted px-3 py-2 text-xs">
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium truncate">{f.name}</span>
                          <span className="text-[10px] text-muted-foreground">{(f.size/1024).toFixed(1)} KB</span>
                        </div>
                        <button type="button" onClick={() => { const next = value.filter((_: File, i: number) => i !== idx); onChange(next); }} className="text-destructive hover:underline">Remove</button>
                      </li>
                    ))}
                  </ul>
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
        render={({ field: { onChange, value = [], ...field } }) => (
          <FormItem>
            <FormLabel>Upload Passport Photos</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {/* uploader */}
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md p-6 text-center hover:border-primary/70 transition cursor-pointer bg-muted/30">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const valid = files.filter(f => f.type.startsWith('image/'));
                      const rejected = files.filter(f => !f.type.startsWith('image/'));
                      if (rejected.length) {
                        alert(`Some files were rejected (not images): ${rejected.map(r=> r.name).join(', ')}`);
                      }
                      if (valid.length) {
                        onChange([...(value || []), ...valid]);
                      }
                      e.target.value = "";
                    }}
                    {...field}
                  />
                  <span className="text-sm font-medium text-primary">Browse</span>
                  <span className="text-xs text-muted-foreground mt-1">or drag & drop images</span>
                  <span className="text-[11px] text-muted-foreground mt-2">JPG, PNG, WEBP</span>
                </label>
                {/* existing images from server */}
                <ExistingFilesList
                  items={watch('existing_passport_photos') || []}
                  onRemove={(id) => {
                    const current = (watch('existing_passport_photos') || []) as { id: number; url: string; name?: string }[];
                    setValue('existing_passport_photos', current.filter((i)=> i.id !== id));
                    const del = (watch('delete_passport_photo_ids') || []) as number[];
                    setValue('delete_passport_photo_ids', [...del, id]);
                  }}
                />
                {/* newly selected files list */}
                {Array.isArray(value) && value.length > 0 && (
                  <ul className="space-y-2">
                    {value.map((f: File, idx: number) => (
                      <li key={idx} className="flex items-center justify-between gap-3 rounded-md border bg-white/50 dark:bg-muted px-3 py-2 text-xs">
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium truncate">{f.name}</span>
                          <span className="text-[10px] text-muted-foreground">{(f.size/1024).toFixed(1)} KB</span>
                        </div>
                        <button type="button" onClick={() => { const next = value.filter((_: File, i: number) => i !== idx); onChange(next); }} className="text-destructive hover:underline">Remove</button>
                      </li>
                    ))}
                  </ul>
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

// Helper component for existing files
function ExistingFilesList({ items, onRemove }: { items: { id: number; url: string; name?: string }[]; onRemove: (id: number)=> void }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 rounded-md border bg-white/50 dark:bg-muted px-3 py-2 text-xs">
          <a href={item.url} target="_blank" rel="noreferrer" className="truncate underline text-blue-600">{item.name || item.url.split('/').pop()}</a>
          <button type="button" onClick={() => onRemove(item.id)} className="text-destructive hover:underline">Remove</button>
        </li>
      ))}
    </ul>
  );
}
