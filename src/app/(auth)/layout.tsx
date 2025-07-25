import {Logo} from '@/components/shared/Logo';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
