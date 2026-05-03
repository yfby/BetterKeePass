/**
 * LoadingBar component - displays a loading progress bar
 */

interface LoadingBarProps {
  isVisible: boolean;
}

export function LoadingBar({ isVisible }: LoadingBarProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-accent loading-bar z-50" />
  );
}
