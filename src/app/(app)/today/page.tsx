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
        dek="Here’s what needs your attention today."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="Questions it answers">
              <QuestionList
                questions={[
                  "Which deals need action today?",
                  "Which customers haven’t heard from us in a while?",
                  "What’s changed since I last checked?",
                  "Why is each item ranked where it is?",
                ]}
              />
            </MarginNote>
            <MarginNote title="What it needs">
              Your accounts, open deals, and activity. Priorities are based only
              on what you&rsquo;ve recorded.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="Your priorities will appear here once you add accounts and deals. Until then this page stays empty. We never fill it with sample data."
          items={[
            {
              title: "Priority list",
              description:
                "What to do next, in order. Mark items done, snooze them, or dismiss them with a reason.",
            },
            {
              title: "Evidence explorer",
              description:
                "Open any recommendation to see the records and calculations behind it.",
            },
            {
              title: "What’s changed",
              description:
                "New activity, stage changes, and score movements since your last visit, each linked to its source.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
