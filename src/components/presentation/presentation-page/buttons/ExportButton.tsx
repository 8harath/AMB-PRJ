"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function ExportButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
      onClick={() =>
        toast.info("Export is unavailable in instant mode because nothing is stored server-side.")
      }
    >
      <Download className="mr-1 h-4 w-4" />
      Export
    </Button>
  );
}
