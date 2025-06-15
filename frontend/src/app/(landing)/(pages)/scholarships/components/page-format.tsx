import type { ScholarshipPageFormat } from "./page-format.types";

type ScholarshipPageFormatProps = {
  data: ScholarshipPageFormat;
};

export default function PageFormat({ data }: ScholarshipPageFormatProps) {
  return (
    <div className="py-10">
      {Object.values(data).map((section, idx) => (
        <div key={idx} className="mb-10">
          {section.heading && (
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
              {section.heading}
            </h2>
          )}
          {section.subheading && (
            <p className="mb-2 text-lg">{section.subheading}</p>
          )}
          {section.items && section.items.length > 0 && (
            <ul className="mb-2 list-disc list-inside space-y-1">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {section.note && (
            <p className="font-medium">
              <span className="text-red-600">Note: </span>
              {section.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
