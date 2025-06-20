import { BGUS_data } from "../../../data/scholarships-data";
import ApplyButton from "../components/apply-button";
import PageFormat from "../components/page-format";
import { TitleStyledComponent } from "../components/styled-components";

export default function BgusPage() {
  return (
    <div className="my-16">
      <TitleStyledComponent>Best Graduating University Students (Scholarship)</TitleStyledComponent>
      <PageFormat data={BGUS_data} />
      <ApplyButton />
    </div>
  );
}
