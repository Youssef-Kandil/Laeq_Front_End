import React from "react";
import { motion } from "framer-motion";

export type SkeletonVariant = "card" | "list" | "avatar" | "text" | "table";

type Props = {
  variant?: SkeletonVariant;
  count?: number; // for list/text lines or table rows
  className?: string; // extra classes
  // table specific
  tableColumns?: number;
  tableRows?: number;
  compact?: boolean;
  onSearch?: (q: string) => void;
};

// Simple shimmer keyframes injected so the component works even if you
// don't add custom Tailwind animation utilities to your config.
const ShimmerStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% { background-position: -200% 0 }
      100% { background-position: 200% 0 }
    }
    .skeleton-shimmer {
      background: linear-gradient(90deg, var(--skeleton-base) 0%, var(--skeleton-highlight) 40%, var(--skeleton-base) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.2s linear infinite;
    }
  `}</style>
);

const defaults = {
  base: "#e6e6e6",
  highlight: "#f3f3f3",
};

// === Reusable small skeleton pieces ===
function ShimmerRect({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ ...style, ["--skeleton-base" as any]: defaults.base, ["--skeleton-highlight" as any]: defaults.highlight }}
    />
  );
}

// === Variants ===
function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div role="status" aria-busy={true} className={`w-full rounded-2xl p-4 shadow-sm bg-white ${className}`}>
      <div className="flex gap-4 items-start">
        <ShimmerRect className="w-28 h-20 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <ShimmerRect className="h-4 rounded-md w-3/4 mb-3" />
          <ShimmerRect className="h-3 rounded-md w-1/2 mb-2" />
          <div className="flex gap-2 mt-3">
            <ShimmerRect className="h-8 w-20 rounded-md" />
            <ShimmerRect className="h-8 w-12 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex items-center gap-4 p-3 rounded-lg" role="status" aria-busy={true}>
      <ShimmerRect className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <ShimmerRect className="h-3 rounded-md w-2/3 mb-2" />
        <ShimmerRect className="h-2 rounded-md w-1/3" />
      </div>
    </motion.div>
  );
}

function AvatarSkeleton() {
  return (
    <div role="status" aria-busy={true} className="inline-flex items-center gap-3">
      <ShimmerRect className="h-12 w-12 rounded-full" />
      <div className="w-36">
        <ShimmerRect className="h-3 rounded-md w-3/4 mb-2" />
        <ShimmerRect className="h-2 rounded-md w-1/2" />
      </div>
    </div>
  );
}

function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div role="status" aria-busy={true} className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerRect key={i} className={`h-3 rounded-md ${i === lines - 1 ? "w-1/3" : "w-full"}`} />
      ))}
    </div>
  );
}

// === TopNavSkeleton used by table variant (search input + buttons are loaders) ===
function TopNavSkeleton() {
  return (
    <div className="w-full bg-white py-3 px-4 flex items-center justify-between">
      {/* left - search input skeleton */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <ShimmerRect className="h-10 w-10 rounded-md mr-2" />
          <ShimmerRect className="h-10 w-64 md:w-80 rounded-lg" />
        </div>
      </div>

      {/* right - buttons skeletons */}
      <div className="flex items-center gap-3">
        <ShimmerRect className="h-10 w-20 rounded-lg" />
        <ShimmerRect className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}

// === Table skeleton variant (outer border removed) ===
function TableSkeleton({ columns = 6, rows = 6, compact = false }: { columns?: number; rows?: number; compact?: boolean }) {
  const colWidths = Array.from({ length: columns }).map((_, i) => (i === 0 ? "w-40" : "w-28"));

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden"> {/* border removed as requested */}
        {/* header */}
        <div className="bg-white px-4 py-3"> 
          <div className="flex items-center gap-4">
            <ShimmerRect className={`h-6 rounded-md ${colWidths[0]}`} />
            <div className="flex-1 flex gap-4">
              {Array.from({ length: columns - 1 }).map((_, idx) => (
                <ShimmerRect key={idx} className={`h-5 rounded-md ${colWidths[idx + 1]}`} />
              ))}
            </div>
          </div>
        </div>

        {/* rows */}
        <div className={`divide-y divide-gray-200/50 ${compact ? "text-sm" : "text-base"}`}>
          {Array.from({ length: rows }).map((_, rIdx) => (
            <motion.div key={rIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: rIdx * 0.03 }} className={`flex items-center gap-4 px-4 py-3 bg-white`}>
              <ShimmerRect className={`flex-shrink-0 h-6 rounded-md ${colWidths[0]}`} />
              <div className="flex-1 flex gap-4 items-center">
                {Array.from({ length: columns - 1 }).map((_, cIdx) => (
                  <ShimmerRect key={cIdx} className={`h-5 rounded-md ${colWidths[cIdx + 1]}`} />
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <ShimmerRect className="h-8 w-20 rounded-md" />
                  <ShimmerRect className="h-8 w-12 rounded-md" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* footer (no border) */}
        <div className="px-4 py-3 bg-white">
          <ShimmerRect className="h-3 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// === Main exported component ===
export default function SkeletonLoader({ variant = "card", count = 3, className = "", tableColumns = 6, tableRows = 6, compact = false }: Props) {
  return (
    <div className={`w-full ${className}`}>
      <ShimmerStyles />

      {variant === "card" && <CardSkeleton />}

      {variant === "list" && (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, idx) => (
            <ListItemSkeleton key={idx} />
          ))}
        </div>
      )}

      {variant === "avatar" && <AvatarSkeleton />}

      {variant === "text" && <TextSkeleton lines={count} />}

      {variant === "table" && (
        <div>
          {/* top nav with search left and buttons right (now skeletons) */}
          <TopNavSkeleton />
          <div className="mt-4">
            <TableSkeleton columns={tableColumns} rows={tableRows} compact={compact} />
          </div>
        </div>
      )}

    </div>
  );
}

/*
Usage examples:

<SkeletonLoader variant="card" />
<SkeletonLoader variant="list" count={4} />
<SkeletonLoader variant="avatar" />
<SkeletonLoader variant="text" count={5} />
<SkeletonLoader variant="table" tableColumns={6} tableRows={8} onSearch={(q)=>console.log(q)} />

Notes:
- Uses Tailwind and framer-motion. Install framer-motion if needed: `npm i framer-motion`.
- Colors can be customized by overriding CSS variables --skeleton-base and --skeleton-highlight.
- If you want RTL support or a non-Tailwind version, tell me and I'll create it.
*/
