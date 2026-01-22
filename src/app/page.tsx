import { CTASection } from "./components/CTASection";
import { DataFlow } from "./components/DataFlow";
import { HeroSection } from "./components/HeroSection";
import { MarketingFooter } from "./components/MarketingFooter";
import { MarketingHeader } from "./components/MarketingHeader";
import { MetricsPreview } from "./components/MetricsPreview";
import { ValueCards } from "./components/ValueCards";


export default function HomePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-primary dark:text-white transition-colors duration-300 min-h-screen">
      <MarketingHeader />
      
      <main className="max-w-[1280px] mx-auto px-6 lg:px-40">
        <HeroSection />
        <ValueCards />
        <DataFlow />
        <MetricsPreview />
        <CTASection />
      </main>

      <MarketingFooter />
    </div>
  )
}