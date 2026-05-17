import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Providers from '@/components/Providers';
import WhyDeterministic from '@/components/WhyDeterministic';
import Examples from '@/components/Examples';
import Acknowledgments from '@/components/Acknowledgments';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Providers />
        <WhyDeterministic />
        <Examples />
        <Acknowledgments />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
