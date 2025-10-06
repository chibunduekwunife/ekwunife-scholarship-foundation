"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Please enter a subject"),
  message: z.string().min(10, "Please enter at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactUsPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: FormValues) => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
    try {
      const res = await fetch(`${base}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || "Failed to send message");
      }
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not send message. Try again later.";
      toast.error(msg);
    }
  };

  return (
    <div className="my-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Contact Us</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Have questions about our scholarships or application process? Send us a message and our team will respond shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={6} placeholder="Write your message here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <Mail className="text-primary mt-0.5" size={18} />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:info@ekwunifescholarship.com" className="text-primary hover:underline">info@ekwunifescholarship.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-primary mt-0.5" size={18} />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+2347038742445" className="text-primary hover:underline">+234 (703)-874-2445</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5" size={18} />
                <div>
                  <p className="font-medium">Address</p>
                  <p>Ekwulobia, Anambra State, Nigeria</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 pt-2">We typically respond within 2–3 business days.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
