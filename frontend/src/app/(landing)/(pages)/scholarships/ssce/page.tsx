import { SSCE_data } from "../components/data";
import PageFormat from "../components/page-format";
import { TitleStyledComponent } from "../components/styled-components";

export default function SscePage() {
  return (
    <div className="mt-16">
      <TitleStyledComponent>Secondary School Scholars SSCE (Scholarship)</TitleStyledComponent>
      <PageFormat data={SSCE_data}/>
    </div>
  );
}
