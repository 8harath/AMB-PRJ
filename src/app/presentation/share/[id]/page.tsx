import { getSharedPresentation } from "@/app/_actions/presentation/sharedPresentationActions";
import Link from "next/link";
import { SharedPresentationClient } from "./SharedPresentationClient";

export default async function SharedPresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSharedPresentation(id);

  if (!result.success || !result.presentation) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-semibold">Presentation not found</h1>
        <p className="max-w-xl text-muted-foreground">
          This presentation doesn&apos;t exist or isn&apos;t publicly shared.
        </p>
        <Link
          href="/presentation"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-all duration-150 hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { presentation } = result;
  const content = presentation.content as {
    slides?: Array<{
      id: string;
      title?: string;
      content?: unknown[];
      rootImage?: { query: string; url?: string; layoutType?: string };
    }>;
  } | null;

  return (
    <SharedPresentationClient
      title={presentation.title}
      theme={presentation.theme}
      slides={content?.slides ?? []}
    />
  );
}
