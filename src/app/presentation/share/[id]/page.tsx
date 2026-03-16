import Link from "next/link";

export default function SharedPresentationPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Sharing is unavailable</h1>
      <p className="max-w-xl text-muted-foreground">
        This deployment runs in instant mode, so presentations are generated in-session only and
        are not stored on the server.
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
