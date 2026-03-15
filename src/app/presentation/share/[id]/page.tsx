import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
        className={cn(buttonVariants({ variant: "default", size: "default" }))}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
