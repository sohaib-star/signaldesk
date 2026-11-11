import type { Metadata } from "next";
import { MarginNote, PageBody } from "@/components/ui/page-body";
import { PageHeader } from "@/components/ui/page-header";
import { ProvenanceLegend } from "@/components/ui/provenance";
import { QuestionList } from "@/components/ui/question-list";
import { ViewBlueprint } from "@/components/ui/view-blueprint";
import { getNavItem } from "../_components/nav-items";

const section = getNavItem("/model");

export const metadata: Metadata = { title: section.label };

export default function ModelPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${section.index} / ${section.summary}`}
        title={section.label}
        dek="See exactly how accounts are scored and why each recommendation appears."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="Questions it answers">
              <QuestionList
                questions={[
                  "What goes into a score?",
                  "Why was this recommended?",
                  "What changes if a factor counts for more?",
                ]}
              />
            </MarginNote>
            <MarginNote title="How AI is used">
              Scores and rankings come from clear rules you can inspect. AI may
              help write summaries later, but it never decides a score or a
              ranking.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="No scoring model has been set up yet."
          items={[
            {
              title: "Scoring lab",
              description:
                "Adjust how much each factor counts and preview the new rankings before you save.",
            },
            {
              title: "Scoring factors",
              description:
                "What each factor measures, how it’s scaled, and what happens when data is missing.",
            },
            {
              title: "Recommendation rules",
              description:
                "When each recommendation appears and how its priority is set.",
            },
            {
              title: "Version history",
              description:
                "Every score is tied to the model version that produced it, so past results can always be reproduced.",
            },
          ]}
        />

        <section aria-labelledby="provenance-heading" className="mt-16">
          <div className="border-b-2 border-ink pb-2">
            <h2
              id="provenance-heading"
              className="font-display text-2xl font-medium tracking-tight"
            >
              Where values come from
            </h2>
          </div>
          <p className="mt-4 mb-6 max-w-[62ch] leading-relaxed text-graphite-700">
            Every value is marked, so you always know whether you&rsquo;re
            looking at a record, a calculation, an estimate, or AI-written text.
          </p>
          <ProvenanceLegend />
        </section>
      </PageBody>
    </>
  );
}
