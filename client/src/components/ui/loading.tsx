import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "pokeball" | "lightning";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<{ size: string; className?: string }> = ({
  size,
  className,
}) => (
  <div
    className={cn(
      "animate-spin rounded-full border-4 border-gray-200",
      size,
      className,
    )}
  >
    <div className="rounded-full border-4 border-transparent border-t-blue-500" />
  </div>
);

const LoadingDots: React.FC<{ size: string }> = ({ size }) => (
  <div className="flex space-x-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          "animate-bounce rounded-full bg-blue-500",
          size === "w-4 h-4"
            ? "w-2 h-2"
            : size === "w-6 h-6"
              ? "w-3 h-3"
              : size === "w-8 h-8"
                ? "w-4 h-4"
                : "w-5 h-5",
        )}
        style={{
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

const LoadingPulse: React.FC<{ size: string }> = ({ size }) => (
  <div className={cn("animate-pulse rounded-full bg-blue-500", size)} />
);

const LoadingPokeball: React.FC<{ size: string }> = ({ size }) => (
  <div className="relative">
    <div
      className={cn(
        "relative rounded-full border-4 border-gray-800 bg-gradient-to-b from-red-500 to-red-600",
        size,
      )}
      style={{
        background:
          "linear-gradient(to bottom, #ef4444 0%, #ef4444 45%, #1f2937 45%, #1f2937 55%, #f3f4f6 55%, #f3f4f6 100%)",
        animation: "spin 2s linear infinite",
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 rounded-full border-2 border-white" />
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800" />
    </div>
  </div>
);

const LoadingLightning: React.FC<{ size: string }> = ({ size }) => (
  <div className={cn("relative", size)}>
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full animate-pulse text-yellow-400"
      style={{
        animation: "flash 1.5s ease-in-out infinite",
      }}
    >
      <path
        fill="currentColor"
        d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.52 13.06 10.58 16.46 11 21z"
      />
    </svg>
  </div>
);

export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "spinner",
  className,
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const renderLoadingIcon = () => {
    const sizeClass = sizeClasses[size];

    switch (variant) {
      case "dots":
        return <LoadingDots size={sizeClass} />;
      case "pulse":
        return <LoadingPulse size={sizeClass} />;
      case "pokeball":
        return <LoadingPokeball size={sizeClass} />;
      case "lightning":
        return <LoadingLightning size={sizeClass} />;
      case "spinner":
      default:
        return (
          <LoadingSpinner
            size={sizeClass}
            className="border-gray-300 border-t-blue-500"
          />
        );
    }
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      {renderLoadingIcon()}
      {text && (
        <p
          className={cn(
            "text-gray-600 font-medium animate-pulse",
            textSizeClasses[size],
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl shadow-2xl">{content}</div>
      </div>
    );
  }

  return content;
};

// Pokemon-themed loading messages
export const pokemonLoadingMessages = [
  "Catching Pokemon...",
  "Loading Pokedex...",
  "Preparing Pokeballs...",
  "Connecting to Professor Oak...",
  "Searching tall grass...",
  "Consulting Pokemon database...",
  "Powering up Pokemon Center...",
  "Training Pokemon...",
  "Exploring new regions...",
  "Collecting Pokemon data...",
];

// Enhanced loading with random Pokemon messages
export const PokemonLoading: React.FC<Omit<LoadingProps, "text">> = (props) => {
  const [message] = React.useState(
    () =>
      pokemonLoadingMessages[
        Math.floor(Math.random() * pokemonLoadingMessages.length)
      ],
  );

  return <Loading {...props} text={message} />;
};

// Skeleton loading component for cards
export const LoadingSkeleton: React.FC<{
  className?: string;
  animate?: boolean;
}> = ({ className, animate = true }) => (
  <div
    className={cn("bg-gray-200 rounded", animate && "animate-pulse", className)}
  />
);

// Pokemon card skeleton
export const PokemonCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex justify-center">
      <LoadingSkeleton className="w-32 h-32 rounded-full" />
    </div>
    <div className="space-y-2 text-center">
      <LoadingSkeleton className="h-6 w-32 mx-auto" />
      <LoadingSkeleton className="h-4 w-16 mx-auto" />
    </div>
    <div className="flex justify-center space-x-2">
      <LoadingSkeleton className="h-6 w-16 rounded-full" />
      <LoadingSkeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <LoadingSkeleton className="h-16 rounded-lg" />
      <LoadingSkeleton className="h-16 rounded-lg" />
    </div>
  </div>
);
