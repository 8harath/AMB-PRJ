"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/provider/theme-provider";

export default function SideBarDropdown({
  shouldViewFullName = false,
}: {
  shouldViewFullName?: boolean;
  side?: "top";
  align?: "start";
}) {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {shouldViewFullName ? (
        <div className="max-w-48 overflow-hidden text-right">
          <p className="truncate text-sm font-medium leading-none">Local Workspace</p>
          <p className="mt-1 truncate text-xs leading-none text-muted-foreground">
            Authentication disabled
          </p>
        </div>
      ) : null}
      <Button size="sm" variant="outline">
        Local mode
      </Button>
    </div>
  );
}
