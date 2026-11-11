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
        dek="A fixed catalogue of named metrics. Each one has a written definition, a formula, and a visible sample size."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="This view answers">
              <QuestionList
                questions={[
                  "How quickly do deals move through each stage?",
                  "Where do deals convert, and where are they lost?",
                  "Is this period better or worse than the last?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Small samples">
              Metrics computed from too few records are withheld and marked as
              insufficient. They are never extrapolated.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="There is no history to measure yet. Metrics appear once deals and their stage changes are recorded."
          items={[
            {
              title: "Metric catalogue",
              description:
                "Every metric with its definition, its formula, and the records it counts.",
            },
            {
              title: "Conversion and velocity",
              description:
                "Stage-to-stage conversion and time in stage, built from recorded stage history rather than inferred.",
            },
            {
              title: "Period comparison",
              description:
                "This period against the previous one, with sample sizes beside every figure.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
