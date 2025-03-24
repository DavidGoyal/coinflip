import Footer from "./ components/Footer";
import Header from "./ components/Header";
import Hero from "./ components/Hero";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-[url(/Home/bg.gif)] bg-cover bg-center flex flex-col items-center">
      <Header heads={69} />
      <Hero />
      <Footer />
    </div>
  );
}
