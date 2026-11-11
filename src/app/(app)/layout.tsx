import { MobileHeader, Rail, SkipLink } from "./_components/shell";

export default function WorkspaceLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SkipLink />
      <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <Rail />
        <MobileHeader />
        <main id="main" tabIndex={-1} className="min-w-0 outline-none">
          {children}
        </main>
      </div>
    </>
  );
}
