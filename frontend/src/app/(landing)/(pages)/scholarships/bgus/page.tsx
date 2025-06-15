import { BGUS_data } from "../components/data";
import PageFormat from "../components/page-format";
import { TitleStyledComponent } from "../components/styled-components";

export default function BgusPage() {
  return (
    <div className="mt-16">
      <TitleStyledComponent>Best Graduating University Students (Scholarship)</TitleStyledComponent>
      <PageFormat data={BGUS_data} />
    </div>
  );
}
