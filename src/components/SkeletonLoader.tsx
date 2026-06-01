interface SkeletonProps {
  type?: "hero" | "grid" | "list" | "page" | "rooms";
}

export default function SkeletonLoader({ type = "page" }: SkeletonProps) {
  if (type === "hero") {
    return (
      <div className="w-full min-h-[85vh] bg-stone-50 flex items-center justify-center p-8 relative overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-[#9C2A2A]/5" />
        <div className="max-w-7xl mx-auto w-full z-10 text-left space-y-6">
          <div className="h-6 w-32 bg-stone-250 rounded-full" />
          <div className="space-y-3">
            <div className="h-16 w-3/4 max-w-xl bg-stone-250 rounded-2xl" />
            <div className="h-16 w-1/2 max-w-lg bg-stone-250 rounded-2xl" />
          </div>
          <div className="h-4 w-2/3 max-w-md bg-stone-250 rounded-lg" />
          <div className="flex space-x-4 pt-4">
            <div className="h-12 w-40 bg-stone-250 rounded-full" />
            <div className="h-12 w-40 bg-stone-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "rooms" || type === "grid") {
    return (
      <div className="py-16 bg-[#FAF2E3]/40 min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-pulse">
          {/* Header Placeholder */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="h-3 w-28 bg-[#9C2A2A]/15 rounded-full mx-auto" />
            <div className="h-10 w-80 bg-stone-250 rounded-xl mx-auto" />
            <div className="h-4 w-96 bg-stone-200 rounded-lg mx-auto" />
          </div>
          
          {/* 3 Columns Cards Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-[32px] border border-stone-200/60 overflow-hidden shadow-sm flex flex-col h-[520px]">
                <div className="h-64 bg-stone-200 w-full" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-6 w-36 bg-stone-250 rounded-lg" />
                      <div className="h-6 w-16 bg-[#9C2A2A]/15 rounded-lg" />
                    </div>
                    <div className="h-4 w-full bg-stone-200 rounded" />
                    <div className="h-4 w-5/6 bg-stone-200 rounded" />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <div className="h-4 w-12 bg-stone-150 rounded" />
                    <div className="h-4 w-12 bg-stone-150 rounded" />
                    <div className="h-4 w-12 bg-stone-150 rounded" />
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                    <div className="h-8 w-24 bg-stone-150 rounded-lg" />
                    <div className="h-10 w-28 bg-stone-250 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Standard Page Skeleton mode fallback
  return (
    <div className="py-24 bg-[#FAF2E3]/55 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-pulse">
        {/* Upper Heading banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="h-3 w-24 bg-[#9C2A2A]/20 rounded-full mx-auto" />
          <div className="h-12 w-64 md:w-96 bg-stone-250 rounded-xl mx-auto" />
          <p className="h-4 w-full bg-stone-200 rounded mx-auto" />
        </div>

        {/* Dynamic bento blocks simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          <div className="lg:col-span-6 aspect-video bg-stone-200 rounded-[32px] w-full" />
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="h-4 w-40 bg-stone-150 rounded" />
            <div className="h-8 w-3/4 bg-stone-250 rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-200 rounded" />
              <div className="h-4 w-full bg-stone-200 rounded" />
              <div className="h-4 w-2/3 bg-stone-200 rounded" />
            </div>
            <div className="pt-4 flex gap-4">
              <div className="h-10 w-28 bg-stone-250 rounded-xl" />
              <div className="h-10 w-28 bg-stone-150 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
