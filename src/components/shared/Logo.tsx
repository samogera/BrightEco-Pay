
import type {FC} from 'react';
import Link from 'next/link';
import { Sun } from 'lucide-react';

export const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 outline-none">
       <div className="rounded-lg bg-primary/10 p-1.5">
          <Sun className="h-6 w-6 text-primary" />
      </div>
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        BrightEco
      </span>
    </Link>
  );
};
