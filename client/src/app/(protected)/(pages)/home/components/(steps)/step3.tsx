import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
                placeholder="(eg Website, Social media , friends)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center gap-2">
        <Checkbox id="referral_complete" />
        <Label htmlFor="referral_complete" className="font-light">
          How did you first learn about this program? Please provide specific
          information
        </Label>
      </div>
      <div className="flex gap-4">
        <Button className="w-40 bg-gray-100 text-primary hover:bg-gray-50">
          Cancel
        </Button>
        <Button className="w-40">Save and Continue</Button>
      </div>
    </div>
  );
}
