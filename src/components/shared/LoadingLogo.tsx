
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

interface LoadingLogoProps {
    className?: string;
}

export function LoadingLogo({ className }: LoadingLogoProps) {
  return (
    <div className={cn("animate-zoom-in-out", className)}>
        <Logo />
    </div>
  );
}
