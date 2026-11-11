import type { Metadata } from "next";
import { MarginNote, PageBody } from "@/components/ui/page-body";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionList } from "@/components/ui/question-list";
import { ViewBlueprint } from "@/components/ui/view-blueprint";
import { getNavItem } from "../_components/nav-items";

const section = getNavItem("/pipeline");

export const metadata: Metadata = { title: section.label };

export default function PipelinePage() {
  return (
    <>
      <PageHeader
        eyebrow={`${section.index} / ${section.summary}`}
        title={section.label}
        dek="See where your deals stand and which ones are falling behind."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="Questions it answers">
              <QuestionList
                questions={[
                  "Where are deals getting stuck?",
                  "Which deals have missed their close date?",
                  "How is value spread across stages?",
                  "What happens if a deal moves forward or slips?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Weighted value">
              A deal&rsquo;s amount multiplied by its chance of closing at its
              current stage. It&rsquo;s shown as an estimate, not a forecast.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="Add deals and they’ll show up here, grouped by stage."
          items={[
            {
              title: "Board and table views",
              description:
                "See open deals by stage, or switch to a sortable table.",
            },
            {
              title: "Stalled and overdue deals",
              description:
                "Deals that have sat in a stage too long or passed their close date are flagged, with the reason shown.",
            },
            {
              title: "Scenario simulator",
              description:
                "Try out what-ifs, like a deal slipping a quarter, without touching your real data.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
