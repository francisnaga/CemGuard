"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-muted-foreground mt-2 mb-6">An unexpected error occurred in the application.</p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
