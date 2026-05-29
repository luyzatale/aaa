import type { Metadata } from "next";
import HomeClient from "@/components/features/HomeClient";

export const metadata: Metadata = {
  title: "Home",
  description: "A peaceful digital recovery sanctuary. AA recovery resources, daily reflections, prayers, and meetings for people in recovery.",
};

export default function HomePage() {
  return <HomeClient />;
}
