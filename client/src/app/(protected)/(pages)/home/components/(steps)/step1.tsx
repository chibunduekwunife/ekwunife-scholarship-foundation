import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step1() {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-7 max-w-lg my-4">
      <FormField
        control={control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter your age" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormDescription>Must be 15 years of age or older</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your identity" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="village"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Village or Town <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter your village or town" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone number <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="9034758949" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="residential_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Residential Address <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Home Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
