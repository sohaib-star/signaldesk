import type { Metadata } from "next";
import { MarginNote, PageBody } from "@/components/ui/page-body";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionList } from "@/components/ui/question-list";
import { ViewBlueprint } from "@/components/ui/view-blueprint";
import { getNavItem } from "../_components/nav-items";

const section = getNavItem("/today");

export const metadata: Metadata = { title: section.label };

export default function TodayPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${section.index} / ${section.summary}`}
        title={section.label}
        dek="A short, ranked list of the decisions that need you, each with the records and calculations behind it."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="This view answers">
              <QuestionList
                questions={[
                  "Which opportunities need action today?",
                  "Which customers are being neglected?",
                  "What changed since I last looked?",
                  "Why is each item ranked where it is?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Requires">
              Accounts, open deals, and activity history. Rankings are computed
              only from recorded data.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="There are no records yet, so there is nothing to rank. This space stays empty until real data exists. Nothing is invented to fill it."
          items={[
            {
              title: "Ranked action queue",
              description:
                "Recommended actions ordered by a documented priority function. Each can be marked done, snoozed, or dismissed with a reason.",
            },
            {
              title: "Evidence explorer",
              description:
                "For any recommendation, the source records it cites, the signals that fired, and the arithmetic that produced its rank.",
            },
            {
              title: "Changes since last visit",
              description:
                "Stage moves, new activity, and score shifts, each attributed to the record that caused it.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
