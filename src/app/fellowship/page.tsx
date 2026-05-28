import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import FellowshipSection from "@/components/features/FellowshipSection";

export const metadata: Metadata = {
  title: "Fellowship",
  description: "Connect with others in AA recovery. Share your contact and find a fellow member near you. We are stronger together.",
};

export default function FellowshipPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="amber" className="mb-4">Fellowship</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          We are stronger{" "}
          <em className="not-italic text-[var(--accent-amber)]">together.</em>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          No one recovers alone. Share your contact and reach out to others who understand.
        </p>
      </div>
      <FellowshipSection />
    </div>
  );
}
