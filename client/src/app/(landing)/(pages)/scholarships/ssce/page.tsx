import { SSCE_data } from "../../../data/scholarships-data";
import PageFormat from "../components/page-format";
import { TitleStyledComponent } from "../components/styled-components";
import ApplyButton from "../components/apply-button";

export default function SscePage() {
  return (
    <div className="my-16">
      <TitleStyledComponent>Secondary School Scholars SSCE (Scholarship)</TitleStyledComponent>
      <PageFormat data={SSCE_data}/>
      <ApplyButton />
    </div>
  );
}
