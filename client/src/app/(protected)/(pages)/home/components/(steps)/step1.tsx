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
import { useEffect, useState } from "react";

const COUNTRY_META: Record<string, { code: string; flag: string; pattern: (val: string) => string; max: number; placeholder: string; label: string;}> = {
  NG: { code: "+234", flag: "🇳🇬", max: 10, placeholder: "803 123 4567", label: "Nigeria", pattern: (v) => v.replace(/\D/g, "").slice(0,10).replace(/(\d{3})(\d{3})(\d{0,4})/, (_,a,b,c)=> c?`${a} ${b} ${c}`:`${a} ${b}`) },
  US: { code: "+1", flag: "🇺🇸", max: 10, placeholder: "555 123 4567", label: "USA", pattern: (v) => v.replace(/\D/g, "").slice(0,10).replace(/(\d{3})(\d{3})(\d{0,4})/, (_,a,b,c)=> c?`${a} ${b} ${c}`:`${a} ${b}`) },
  CA: { code: "+1", flag: "🇨🇦", max: 10, placeholder: "416 123 4567", label: "Canada", pattern: (v) => v.replace(/\D/g, "").slice(0,10).replace(/(\d{3})(\d{3})(\d{0,4})/, (_,a,b,c)=> c?`${a} ${b} ${c}`:`${a} ${b}`) },
};

export default function Step1() {
  const { control, setValue, watch } = useFormContext();
  const country = watch("phone_country") as keyof typeof COUNTRY_META | undefined || 'NG';
  const phoneValue = watch("phone_number") as string | undefined;
  const meta = COUNTRY_META[country];
  const [nationalRaw, setNationalRaw] = useState("");

  // Initialize from stored full number
  useEffect(() => {
    if (phoneValue && phoneValue.startsWith(meta.code)) {
      const digits = phoneValue.replace(/\D/g, "").slice(meta.code.replace('+','').length);
      setNationalRaw(digits.slice(0, meta.max));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const handleCountryChange = (val: string) => {
    setValue('phone_country', val, { shouldValidate: true });
    setValue('phone_number', '');
    setNationalRaw('');
  };

  const handleNationalChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, meta.max);
    setNationalRaw(digits);
    const full = meta.code + digits;
    setValue('phone_number', full, { shouldValidate: true });
  };

  const formatted = meta.pattern(nationalRaw);

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
                <SelectTrigger><SelectValue placeholder="Select your identity" /></SelectTrigger>
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
            <FormControl><Input placeholder="Enter your village or town" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Country + Phone */}
      <div className="space-y-2">
        <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
        <div className="flex gap-2">
          <FormField
            control={control}
            name="phone_country"
            render={({ field }) => (
              <FormItem className="w-36">
                <Select onValueChange={(v)=> { field.onChange(v); handleCountryChange(v); }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NG">🇳🇬 Nigeria</SelectItem>
                    <SelectItem value="US">🇺🇸 USA</SelectItem>
                    <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="phone_number"
            render={() => (
              <FormItem className="flex-1">
                <div className="flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring overflow-hidden">
                  <div className="flex items-center gap-1 px-3 bg-muted/40 border-r border-input text-sm whitespace-nowrap select-none">
                    <span>{meta.flag}</span>
                    <span className="font-medium">{meta.code}</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9 ]*"
                    placeholder={meta.placeholder}
                    value={formatted}
                    onChange={(e)=> handleNationalChange(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 outline-none text-sm tracking-wide"
                  />
                </div>
                <FormDescription>
                  {country === 'NG' ? '10 digits after +234 (no leading 0).' : '10 digits after +1.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormField
        control={control}
        name="residential_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Residential Address <span className="text-red-500">*</span></FormLabel>
            <FormControl><Input placeholder="Home Address" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
