export default function ExistingApplicationSection() {
  return (
    <div className="my-15">
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-semibold">
          My Scholarship Applications (0)
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <p className="text-gray-500">You have not applied to a scholarship yet</p>
        </div>
      </div>
    </div>
  );
}
