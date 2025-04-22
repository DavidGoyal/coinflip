import Footer from "./ components/Footer";
import Header from "./ components/Header";
import Hero from "./ components/Hero";

export default function Home() {
  return (
    <>
      <div className="hidden xl:block w-screen min-h-screen bg-[url(/Home/bg.gif)] bg-cover bg-center flex flex-col items-center">
        <Header />
        <Hero />
        <Footer />
      </div>
      <div className="flex xl:hidden flex-row bg-[url(/Home/bg.gif)] bg-cover bg-center justify-center items-center h-screen w-screen">
        <h1 className={`text-white text-5xl text-center`}>
          COMING SOON ON SMALL SCREENS
        </h1>
      </div>
    </>
  );
}
