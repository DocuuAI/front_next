"use client";

export function ScrollDownIndicator() {
  return (
    <div className="flex justify-center mt-5">
      <div className="relative h-12 w-7 rounded-full border-2 border-white/30 flex items-start justify-center">
        <span className="mt-2 h-2 w-1 rounded-full bg-white/70 animate-scroll" />
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          70% {
            transform: translateY(14px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 0;
          }
        }

        .animate-scroll {
          animation: scroll 1.6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}