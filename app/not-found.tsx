"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold tracking-tight">404 - Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-6">The requested resource could not be found.</p>
      <Link href="/dashboard" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        Return to Dashboard
      </Link>
    </div>
  );
}
