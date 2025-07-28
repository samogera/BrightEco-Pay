import {Sun} from 'lucide-react';
import type {FC} from 'react';
import Link from 'next/link';

export const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 outline-none">
      <div className="p-1.5 bg-primary rounded-lg">
        <Sun className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        BrightEco Pay
      </span>
    </Link>
  );
};
