import Link from "next/link";

const Hero = () => {
  return (
    <section className="w-full py-32 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-heading mb-4">
          WHERE INNOVATION MEETS
        </h1>
        <p className="text-lg text-paragraph mb-8">
          We have considered our solutions to support every stage of your growth
          and get the potential service
        </p>
        <div className="inline-flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-primary hover:bg-primary/90 text-white text-sm px-6 py-3 rounded font-semibold transition"
          >
            REGISTER ACCOUNT
          </Link>
          <Link
            href="/signin"
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
