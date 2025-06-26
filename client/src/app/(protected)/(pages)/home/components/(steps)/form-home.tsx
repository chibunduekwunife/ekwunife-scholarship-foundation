import { Button } from "@/components/ui/button";

export default function FormHome() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">
        Ekwunife Scholarship Application
      </h1>
      <p className="text-gray-700">
        Thank you for your interest in the Ekwunife Scholarship Foundation&apos;s
        graduate degree and certificate support programs. To get started and for
        detailed instructions on how to submit your application, please visit
        the official Application Guide. At the Foundation, our review committee
        and program coordinators work together to assess each application. As an
        applicant, you&apos;ll communicate with both teams throughout the selection
        process. We look forward to receiving your application!
      </p>
      <Button className="my-15 md:w-40" onClick={() => {}}>Apply Now</Button>
    </div>
  );
}
