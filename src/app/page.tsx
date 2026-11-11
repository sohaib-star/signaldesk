import { redirect } from "next/navigation";

/** The workspace has no landing page of its own; Today is the front door. */
export default function Home() {
  redirect("/today");
}
