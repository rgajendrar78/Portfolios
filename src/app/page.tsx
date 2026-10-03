import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { About } from "@/components/sections/about/about";
import { AppliedAi } from "@/components/sections/applied-ai/applied-ai";
import { Contact } from "@/components/sections/contact/contact";
import { Experience } from "@/components/sections/experience/experience";
import { Hero } from "@/components/sections/hero/hero";
import { Impact } from "@/components/sections/impact/impact";
import { Principles } from "@/components/sections/principles/principles";
import { ResumeBand } from "@/components/sections/resume/resume-band";
import { Stack } from "@/components/sections/stack/stack";
import { Work } from "@/components/sections/work/work";
import { Section } from "@/components/ui/section";
import { portfolio } from "@/config/portfolio";
import { experienceYears } from "@/lib/derive";

export default function Home() {
  const now = new Date();
  const years = experienceYears(now);

  return (
    <>
      <Header />
      <main>
        <Hero years={years} />
        <Section id="work" index="01" copy={portfolio.work}>
          <Work />
        </Section>
        <Section id="about" index="02" copy={portfolio.about}>
          <About />
        </Section>
        <Section id="principles" index="03" copy={portfolio.principles}>
          <Principles />
        </Section>
        <Section id="ai" index="04" copy={portfolio.ai}>
          <AppliedAi />
        </Section>
        <Section id="stack" index="05" copy={portfolio.stack}>
          <Stack />
        </Section>
        <Section id="experience" index="06" copy={portfolio.experience}>
          <Experience years={years} />
        </Section>
        <Section id="impact" index="07" copy={portfolio.impact}>
          <Impact />
        </Section>
        <ResumeBand />
        <Section id="contact" index="08" copy={portfolio.contact} emphasisClassName="text-accent">
          <Contact />
        </Section>
      </main>
      <Footer year={now.getFullYear()} />
      <RevealOnScroll />
      <SmoothScroll />
    </>
  );
}
