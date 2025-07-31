import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import myLogo from './mylogo.png'; // Import the image

export const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 outline-none">
      {/* Use the imported image directly */}
      <Image
        src={myLogo}
        alt="BrightEco Logo"
        width={32} // Increased width
        height={32} // Increased height
      />
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        BrightEco
      </span>
    </Link>
  );
};
