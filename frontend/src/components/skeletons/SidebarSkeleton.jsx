import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200 animate-fade-in"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400 animate-subtle-bounce" />
          <span className="font-medium hidden lg:block text-transparent bg-gradient-to-r from-indigo-400/80 to-cyan-400/80 bg-clip-text animate-gradient">
            Contacts
          </span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 hover:bg-[#1E293B]/30 transition-colors duration-300"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 animate-pulse"></div>
              <div className="skeleton size-12 rounded-full bg-gradient-to-r from-[#1E293B] to-[#334155] animate-shimmer bg-[length:800px_100%]" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div
              className="hidden lg:block text-left min-w-0 flex-1 animate-fade-in"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="skeleton h-4 w-32 mb-2 bg-gradient-to-r from-[#1E293B] to-[#334155] animate-shimmer bg-[length:600px_100%]" />
              <div className="skeleton h-3 w-16 bg-gradient-to-r from-[#1E293B] to-[#334155] animate-shimmer bg-[length:400px_100%]" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
