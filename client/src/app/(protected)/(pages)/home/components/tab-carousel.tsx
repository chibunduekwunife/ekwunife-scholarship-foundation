"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import clsx from "clsx";

interface TabButton {
  id: number;
  title: string;
  value: string;
  content: React.ComponentType;
}

interface TabCarouselProps {
  tabs: TabButton[];
  currentTab: string;
  onTabChange: (tabValue: string) => void;
}

export default function TabCarousel({ tabs, currentTab, onTabChange }: TabCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Auto scroll to selected tab
  const handleTabChange = (tabValue: string) => {
    onTabChange(tabValue);
    
    if (carouselApi) {
      const tabIndex = tabs.findIndex(tab => tab.value === tabValue);
      if (tabIndex !== -1) {
        // Calculate the slide to show the selected tab in view
        // Since we show 2 tabs per view (basis-1/2), we want to scroll to show the selected tab
        const slideIndex = Math.max(0, tabIndex - 1); // Show selected tab and next one
        carouselApi.scrollTo(slideIndex);
      }
    }
  };

  useEffect(() => {
    if (!carouselApi) return;
    
    // Initial scroll to show the current tab
    const currentIndex = tabs.findIndex(tab => tab.value === currentTab);
    if (currentIndex !== -1) {
      const slideIndex = Math.max(0, currentIndex - 1);
      carouselApi.scrollTo(slideIndex);
    }
  }, [carouselApi, currentTab, tabs]);

  return (
    <div className="md:hidden mb-6">
      <Carousel 
        className="w-full max-w-xs mx-auto"
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent>
          {tabs.map((tab) => (
            <CarouselItem key={tab.id} className="basis-1/2">
              <Button
                variant={"ghost"}
                onClick={() => handleTabChange(tab.value)}
                className={clsx(
                  "w-full text-center text-sm px-2 py-2",
                  currentTab === tab.value && "bg-gray-200"
                )}
              >
                {tab.title}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
