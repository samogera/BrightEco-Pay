
import type {FC} from 'react';
import Link from 'next/link';

export const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 outline-none">
       <div className="p-1.5 bg-primary/20 rounded-lg">
         <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
      </div>
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        BrightEco
      </span>
    </Link>
  );
};

    