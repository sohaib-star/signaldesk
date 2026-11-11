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
        dek="The complete, inspectable definition of how SignalDesk scores accounts and decides what to recommend. Nothing is hidden behind it."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="This view answers">
              <QuestionList
                questions={[
                  "What goes into a score?",
                  "Why did this recommendation fire?",
                  "What would change if a factor mattered more?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Principle">
              Intelligence here is deterministic first. A language model may
              write summaries later, but it never produces a score or a ranking.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="No scoring model has been defined yet."
          items={[
            {
              title: "Scoring laboratory",
              description:
                "Adjust signal weights and preview how account rankings would change before anything is saved.",
            },
            {
              title: "Signal definitions",
              description:
                "Each input to a score: what it measures, how it is normalised, and when it counts as unavailable.",
            },
            {
              title: "Recommendation rules",
              description:
                "The conditions under which each recommendation fires, and how its priority is calculated.",
            },
            {
              title: "Version history",
              description:
                "Every score records the model version that produced it, so any past result can be reproduced.",
            },
          ]}
        />

        <section aria-labelledby="provenance-heading" className="mt-16">
          <div className="border-b-2 border-ink pb-2">
            <h2
              id="provenance-heading"
              className="font-display text-2xl font-medium tracking-tight"
            >
              Provenance
            </h2>
          </div>
          <p className="mt-4 mb-6 max-w-[62ch] leading-relaxed text-graphite-700">
            Every value in SignalDesk carries one of four marks, so it is always
            clear whether you are reading a record, a calculation, an
            assumption, or generated text.
          </p>
          <ProvenanceLegend />
        </section>
      </PageBody>
    </>
  );
}
