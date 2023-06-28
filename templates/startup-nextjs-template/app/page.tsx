import AboutSectionOne from '@/components/About/AboutSectionOne';
import AboutSectionTwo from '@/components/About/AboutSectionTwo';
import Blog from '@/components/Blog';
import Brands from '@/components/Brands';
import ScrollUp from '@/components/Common/ScrollUp';
import Contact from '@/components/Contact';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Video from '@/components/Video';
import { Inter } from '@next/font/google';
import { startupNextJsTemplateSchema } from 'core';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  const template = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/template`,
  );
  const { data } = (await template.json()) as {
    data: typeof startupNextJsTemplateSchema.__outputType;
  };

  return (
    <main>
      <ScrollUp />
      <Hero {...data.hero} />
      <Features />
      <Video />
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact />
    </main>
  );
}
