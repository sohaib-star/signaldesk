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
        dek="Everyone you sell to, and every conversation you’ve had with them."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="Questions it answers">
              <QuestionList
                questions={[
                  "Who are our leads, prospects, and customers?",
                  "When did we last talk to this account?",
                  "Which accounts look strongest, and why?",
                ]}
              />
            </MarginNote>
            <MarginNote title="Leads">
              A lead is simply an account at an early stage. When it converts,
              it stays the same record. Nothing is copied.
            </MarginNote>
          </>
        }
      >
        <ViewBlueprint
          statement="You haven’t added any accounts yet."
          items={[
            {
              title: "Search and filters",
              description:
                "Find any account quickly. Filters are saved in the link, so you can bookmark or share a view.",
            },
            {
              title: "Account page",
              description:
                "Contacts, deals, activity, and score for one company, all in one place.",
            },
            {
              title: "Lifecycle stages",
              description:
                "Lead, prospect, customer, churned. Every change is logged with who made it and when.",
            },
          ]}
        />
      </PageBody>
    </>
  );
}
