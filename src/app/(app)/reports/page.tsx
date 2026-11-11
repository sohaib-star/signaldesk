import type { Metadata } from "next";
import { MarginNote, PageBody } from "@/components/ui/page-body";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionList } from "@/components/ui/question-list";
import { ViewBlueprint } from "@/components/ui/view-blueprint";
import { getNavItem } from "../_components/nav-items";

const section = getNavItem("/reports");

export const metadata: Metadata = { title: section.label };

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${section.index} / ${section.summary}`}
        title={section.label}
        dek="See how sales are performing, and exactly how each number is calculated."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="Questions it answers">
              <QuestionList
                questions={[
                  "How long do deals spend in each stage?",
                  "Where do we win deals, and where do we lose them?",
                  "Are we doing better than last period?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Small samples">
              When there isn&rsquo;t enough data for a reliable number, we say
              so instead of guessing.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="Reports need some history to work with. They’ll fill in as you record deals and move them through stages."
          items={[
            {
              title: "Metric library",
              description:
                "Every metric, with a plain definition and the formula behind it.",
            },
            {
              title: "Conversion and speed",
              description:
                "How deals move from stage to stage and how long each stage takes, based on what actually happened.",
            },
            {
              title: "Period comparison",
              description:
                "This period against the last, with the number of deals behind each figure.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
