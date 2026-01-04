import { LoaderIcon } from "lucide-react";

const LoadingSpinner = ({
  label = "Loading...",
  size = 40,
  fullscreen = false,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center gap-4 ${
        fullscreen ? "min-h-screen" : "py-20"
      }`}
    >
      <LoaderIcon
        className="animate-spin text-primary"
        style={{ width: size, height: size }}
      />

      <p className="text-sm text-base-content/60 animate-pulse">
        {label}
      </p>
    </div>
  );
};

export default LoadingSpinner;
