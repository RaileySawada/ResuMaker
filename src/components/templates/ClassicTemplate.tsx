import type { ResumeData } from "../../lib/types";
import AtsTemplate from "./AtsTemplate";

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  return <AtsTemplate data={data} variant="classic" />;
}
