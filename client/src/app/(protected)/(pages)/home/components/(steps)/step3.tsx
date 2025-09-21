import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export default function Step3() {
  const { control, watch } = useFormContext();
  
  // Watch the essay field to count words in real-time
  const essayText = watch("essay") || "";
  
  // Function to count words
  const countWords = (text: string): number => {
    if (!text || text.trim() === "") return 0;
    return text.trim().split(/\s+/).length;
  };
  
  const wordCount = countWords(essayText);
  const maxWords = 500;
  const minWords = 100;
  
  // Determine color based on word count
  const getWordCountColor = () => {
    if (wordCount < minWords) return "text-orange-600";
    if (wordCount > maxWords) return "text-red-600";
    return "text-green-600";
  };

  return (
    <div className="flex flex-col gap-7 max-w-lg my-4">
      <FormField
        control={control}
        name="essay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              &quot;Why I deserve This Scholarship&quot; or &quot;My Academic Journey&quot; <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Not more than 500 words"
                className="h-50"
                {...field}
              />
            </FormControl>
            <div className="flex justify-between items-center mt-2">
              <div className={`text-sm font-medium ${getWordCountColor()}`}>
                {wordCount} / {maxWords} words
              </div>
              <div className="text-xs text-gray-500">
                {wordCount < minWords ? `${minWords - wordCount} words needed` : 
                 wordCount > maxWords ? `${wordCount - maxWords} words over limit` : 
                 "Perfect length!"}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="referral_source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              How did you first learn about this program? Please provide
              specific information. <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="(eg Website, Social media, friends)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="referral_source_confirmed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I confirm the accuracy of my referral source information
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
