import FormHome from "../(pages)/home/components/(steps)/form-home";
import Step1 from "../(pages)/home/components/(steps)/step1";
import Step2 from "../(pages)/home/components/(steps)/step2";
import Step3 from "../(pages)/home/components/(steps)/step3";
import Step4 from "../(pages)/home/components/(steps)/step4";


export const tab_buttons = [
    {
        id: 1, value: "home", title: "Home", content: FormHome
    },
    {
        id: 2, value: "personal information", title: "Personal Information", content: Step1
    },
    {
        id: 3, value: "academic background", title: "Academic Background", content: Step2
    },
    {
        id: 4, value: "essay", title: "Essay", content: Step3,
    },
    {
        id: 5, value: "program checklist", title: "Program Checklist", content: Step4,
    }
  ]