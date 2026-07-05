'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center h-10"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Authenticating...
        </>
      ) : (
        'Sign In'
      )}
    </button>
  );
}
