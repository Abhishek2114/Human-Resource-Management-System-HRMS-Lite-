
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-9xl font-black text-primary/20">404</h1>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[400px] mx-auto">
          The page you are looking for might have been moved, deleted, or does not exist.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          Return to Dashboard
        </Link>
      </Button>
    </div>
  );
}
