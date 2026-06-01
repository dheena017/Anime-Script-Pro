import { useEffect, useState } from "react";
import { useGeneratorState } from "@/hooks/useGenerator";
import {
  Loader2,
  Users,
  Fingerprint,
  Brain,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { CharacterTab } from "./components/CharacterToolbar";

interface CharactersLoadingPageProps {
  tab?: CharacterTab;
  title?: string;
  description?: string;
  progress?: number;
}

const TAB_META: Record<
  string,
  {
    title: string;
    description: string;
    icon: any;
    color: string;
    accentColor: string;
    borderColor: string;
    bgColor: string;
    shadowColor: string;
  }
> = {
  registry: {
    title: "Creating Characters",
    description: "Building character profiles and backstories",
    icon: Users,
    color: "text-purple-400",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgColor: "bg-purple-500/5",
    shadowColor: "rgba(168, 85, 247, 0.1)",
  },
  dna: {
    title: "Analyzing Character Traits",
    description: "Mapping personality and behavioral patterns",
    icon: Fingerprint,
    color: "text-pink-400",
    accentColor: "text-pink-400",
    borderColor: "border-pink-500/20",
    bgColor: "bg-pink-500/5",
    shadowColor: "rgba(236, 72, 153, 0.1)",
  },
  dynamics: {
    title: "Mapping Relationships",
    description: "Determining character relationships and group dynamics",
    icon: Brain,
    color: "text-violet-400",
    accentColor: "text-violet-400",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/5",
    shadowColor: "rgba(167, 139, 250, 0.1)",
  },
  integrity: {
    title: "Checking Consistency",
    description: "Verifying character and narrative consistency",
    icon: ShieldCheck,
    color: "text-blue-400",
    accentColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    shadowColor: "rgba(59, 130, 246, 0.1)",
  },
  "add-lead": {
    title: "Adding Character",
    description: "Adding your custom character to the cast",
    icon: UserPlus,
    color: "text-emerald-400",
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    shadowColor: "rgba(16, 185, 129, 0.1)",
  },
};

const LoadingDots = ({ color }: { color: string }) => (
  <div className="flex items-center gap-1">
    <div
      className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`}
      style={{ animationDelay: "0s" }}
    />
    <div
      className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`}
      style={{ animationDelay: "0.2s" }}
    />
    <div
      className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`}
      style={{ animationDelay: "0.4s" }}
    />
  </div>
);

export function CharactersLoadingPage({
  tab,
  title,
  description,
  progress,
}: CharactersLoadingPageProps) {
  const gen = useGeneratorState();
  const isActive = gen.isGeneratingCharacters || gen.isLoading;

  const [localProgress, setLocalProgress] = useState<number>(
    typeof progress === "number" ? progress : 0,
  );

  useEffect(() => {
    if (typeof progress === "number") {
      setLocalProgress(progress);
      return;
    }
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      setLocalProgress((p) => (p > 0 ? p : 3));
      interval = setInterval(
        () =>
          setLocalProgress((prev) =>
            Math.min(80, prev + Math.random() * 6 + 1),
          ),
        700,
      );
    } else if (!isActive && localProgress > 0) {
      setLocalProgress(100);
      const t = setTimeout(() => setLocalProgress(0), 700);
      return () => clearTimeout(t);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, progress]);

  const meta =
    tab && TAB_META[tab]
      ? TAB_META[tab]
      : {
          title: title || "Creating Your Characters",
          description:
            description || "Building character profiles and relationships",
          icon: Users,
          color: "text-purple-400",
          accentColor: "text-purple-400",
          borderColor: "border-purple-500/20",
          bgColor: "bg-purple-500/5",
          shadowColor: "rgba(168, 85, 247, 0.1)",
        };

  const Icon = meta?.icon ?? Users;

  return (
    <div className="w-full py-20 flex items-center justify-center min-h-[500px]">
      <div
        className={`w-full max-w-3xl rounded-[2rem] border ${meta.borderColor} bg-[#050505] px-8 py-16 text-center backdrop-blur-sm`}
        style={{ boxShadow: `0 0 60px ${meta.shadowColor}` }}
      >
        {/* Icon Container with Pulse */}
        <div className="mx-auto mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`h-20 w-20 rounded-3xl ${meta.bgColor} border ${meta.borderColor} animate-pulse`}
            />
          </div>
          <div
            className={`relative flex h-20 w-20 items-center justify-center rounded-3xl border ${meta.borderColor} ${meta.bgColor}`}
          >
            <Icon className={`h-10 w-10 ${meta.color}`} />
          </div>
        </div>

        {/* Loading Title */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className={`h-5 w-5 animate-spin ${meta.accentColor}`} />
          <p
            className={`text-[12px] font-black uppercase tracking-[0.28em] text-white ${meta.accentColor}`}
          >
            {meta.title}
          </p>
        </div>

        {/* Description */}
        <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        {/* Progress Bar */}
        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-300 ${meta.bgColor}`}
            style={{
              width: `${typeof progress === "number" ? progress : localProgress}%`,
            }}
          />
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <LoadingDots color={meta.accentColor} />
        </div>

        {/* Status Text */}
        <div
          className={`flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] ${meta.color}`}
        >
          <div
            className={`h-2 w-2 rounded-full ${meta.accentColor} animate-pulse`}
          />
          AI is creating your characters
          <span className="ml-2 text-xs font-black text-zinc-400">
            {Math.round(
              typeof progress === "number" ? progress : localProgress,
            )}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
