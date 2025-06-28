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
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-7 max-w-lg my-4">
      <FormField
        control={control}
        name="essay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              &quot;Why I deserve This Scholarship&quot; or &quot;My Academic Journey&quot;
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Not more than 500 words"
                className="h-50"
                {...field}
              />
            </FormControl>
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
              specific information.
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
