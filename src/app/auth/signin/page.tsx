"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Authentication disabled</CardTitle>
          <CardDescription>
            This deployment uses a built-in local workspace user, so no sign-in is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/presentation">Open dashboard</Link>
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Configure `LOCAL_USER_EMAIL` only if you want to rename the default workspace user.
        </CardFooter>
      </Card>
    </div>
  );
}
