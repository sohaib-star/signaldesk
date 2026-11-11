import type { Metadata } from "next";
import { MarginNote, PageBody } from "@/components/ui/page-body";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionList } from "@/components/ui/question-list";
import { ViewBlueprint } from "@/components/ui/view-blueprint";
import { getNavItem } from "../_components/nav-items";

const section = getNavItem("/accounts");

export const metadata: Metadata = { title: section.label };

export default function AccountsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${section.index} / ${section.summary}`}
        title={section.label}
        dek="The companies you sell to, the people inside them, and the full record of every interaction."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="This view answers">
              <QuestionList
                questions={[
                  "Who are our leads, prospects, and customers?",
                  "When did we last speak to this account?",
                  "Which accounts score highest, and why?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Model note">
              A lead is a lifecycle stage on an account, not a separate kind of
              record. Converting a lead never duplicates data.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="No accounts have been recorded yet."
          items={[
            {
              title: "Directory and segments",
              description:
                "Search, filter, and sort every account. Filters live in the URL, so any segment can be bookmarked or shared.",
            },
            {
              title: "Account dossier",
              description:
                "One company's contacts, deals, interaction timeline, and score breakdown on a single page.",
            },
            {
              title: "Lifecycle stages",
              description:
                "Lead, prospect, customer, churned. Every transition is recorded with its date and author.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
