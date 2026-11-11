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
        dek="Every open deal by stage, with stalls and slipped dates marked against explicit thresholds."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="This view answers">
              <QuestionList
                questions={[
                  "Where is revenue stuck?",
                  "Which deals have slipped their close date?",
                  "How is value spread across stages?",
                  "What happens to the pipeline if a deal moves?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Definition">
              <em>Weighted value</em> is a deal&rsquo;s amount multiplied by its
              stage probability. It is labelled as an estimate, never presented
              as a forecast.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="No deals have been recorded, so there is no pipeline to show."
          items={[
            {
              title: "Stage board and table",
              description:
                "Open deals grouped by stage, switchable to a dense sortable table.",
            },
            {
              title: "Stall and slip markers",
              description:
                "Deals past their stage's stale threshold or past their expected close date, each flagged with the rule that triggered it.",
            },
            {
              title: "Scenario simulator",
              description:
                "Explore hypothetical changes, such as a deal slipping a quarter or a stage converting better. Computed in memory and never written to real records.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
