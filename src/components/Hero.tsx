import Link from "next/link";

const Hero = () => {
  return (
    <section className="w-full pt-24 px-3 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="px-4 py-2 bg-[#00000020]  mb-4 text-heading max-w-xs font-semibold mx-auto">
          Smart Choices, Wealthy Tomrrow
        </h2>
        <h1 className="text-4xl font-extrabold text-heading mb-4">
          WHERE INNOVATION MEETS
        </h1>
        <p className="text-lg text-paragraph mb-8">
          We have considered our solutions to support every stage of your growth
          and get the potential service
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-primary hover:bg-primary/90 text-white text-sm px-6 py-3 rounded font-semibold transition"
          >
            REGISTER ACCOUNT
          </Link>
          <Link
            href="/login"
            className="bg-accent hover:bg-accent/90 text-white text-sm px-6 py-3 rounded font-semibold transition"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
