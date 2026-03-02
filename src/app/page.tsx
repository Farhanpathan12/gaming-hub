import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ValuationWizard from "@/components/ValuationWizard";
import InventoryGrid from "@/components/InventoryGrid";
import Testimonials from "@/components/Testimonials";
import GamingPass from "@/components/GamingPass";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <InventoryGrid />
      <ValuationWizard />
      <GamingPass />
      <Testimonials />
    </main>
  );
}

