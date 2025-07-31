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
            d="M13.4445 12.2852L10.5556 16.1423L13.4445 22.1994L19.2223 11.1423H13.4445V2H7.66675L4.77783 10.0001H10.5556V12.2852L13.4445 12.2852Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            />
        </svg>
      </div>
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        BrightEco Pay
      </span>
    </Link>
  );
};
