"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { formSchema } from "./form-schema";
import { tab_buttons } from "@/app/(protected)/data/scholarship-application";
import clsx from "clsx";

export default function MultiStepForm() {
  const [currentTab, setCurrentTab] = useState<string>("home");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      age: 15,
      gender: "",
      village: "",
      phone: "",
      address: "",
      category: "",
      secondary_school: "",
      graduating_year: [],
      // grades: [],
      result_documents: undefined,
      passport_photo: undefined,
      essay: "",
      referral_source: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const TabContent =
    tab_buttons.find((tab) => tab.value === currentTab)?.content || null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 my-15">
      <div className="flex md:flex-col">
        {tab_buttons.map((tab) => (
          <Button
            key={tab.id}
            value={tab.value}
            variant={"ghost"}
            onClick={() => setCurrentTab(tab.value)}
            className={clsx(
              "md:w-full text-left justify-start",
              currentTab === tab.value && "bg-gray-200"
            )}
          >
            {tab.title}
          </Button>
        ))}
      </div>
      <div className="col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {TabContent && <TabContent />}
          </form>
        </Form>
      </div>
      
    </div>
  );
}
