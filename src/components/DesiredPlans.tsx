import Image from "next/image";
import Link from "next/link";

interface PlanCard {
  image: string;
  name: string;
  rupees: number;
  dailyReturn: number;
  capitalReturn: boolean;
  returnType: string;
  totalPeriods: number;
  cancellation: boolean;
  totalRevenue: number;
}

const planCards: PlanCard[] = [
  {
    image: "/solar.webp",
    name: "SOLAR-1",
    rupees: 1000,
    dailyReturn: 90,
    capitalReturn: false,
    returnType: "Period",
    totalPeriods: 90,
    cancellation: false,
    totalRevenue: 8100,
  },
  {
    image: "/solar.webp",
    name: "PROPERTY-3",
    rupees: 3000,
    dailyReturn: 270,
    capitalReturn: false,
    returnType: "Period",
    totalPeriods: 90,
    cancellation: false,
    totalRevenue: 24300,
  },
  {
    image: "/solar.webp",
    name: "POWER-5",
    rupees: 5000,
    dailyReturn: 450,
    capitalReturn: false,
    returnType: "Period",
    totalPeriods: 90,
    cancellation: false,
    totalRevenue: 40500,
  },
  {
    image: "/solar.webp",
    name: "COAL-10",
    rupees: 10000,
    dailyReturn: 900,
    capitalReturn: false,
    returnType: "Period",
    totalPeriods: 90,
    cancellation: false,
    totalRevenue: 81000,
  },
];

const DesiredPlans = () => {
  return (
    <section className="w-full pt-10 px-3 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="py-2 rounded-full bg-[#FFFFFF20] mb-4 text-heading max-w-[15rem] text-xs font-semibold mx-auto">
          Our Desired Plans
        </h2>
        <h1 className="text-2xl font-semibold text-heading mb-4">
          The plans we offer are specifically made for you
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {planCards.map((plan, idx) => (
          <div key={idx} className="rounded-lg shadow-md py-6 text-left">
            <Image
              src={plan.image}
              alt={plan.name}
              width={300}
              height={200}
              className="rounded-md object-cover w-full mb-4"
            />
            <div className="flex flex-col ">
              <h3 className="flex px-3 py-2 text-lg font-bold mb-2 text-heading bg-card">
                {plan.name}
              </h3>
              <p className="text-lg font-bold my-1 text-paragraph">
                PKR {plan.rupees}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm font-medium text-paragraph">
              <p className="font-medium">Daily Return:</p>
              <p className="bg-card py-1 px-2">PKR {plan.dailyReturn}</p>

              <p className="font-medium">Total Revenue:</p>
              <p className="bg-card py-1 px-2">PKR {plan.totalRevenue}</p>

              <p className="font-medium">Capital Return:</p>
              <p className="bg-card py-1 px-2">
                {plan.capitalReturn ? "Yes" : "No"}
              </p>

              <p className="font-medium">Total Period:</p>
              <p className="bg-card py-1 px-2">{plan.totalPeriods} days</p>

              <p className="font-medium">Return Type:</p>
              <p className="bg-card py-1 px-2">{plan.returnType}</p>

              <p className="font-medium">Cancellation:</p>
              <p className="bg-card py-1 px-2">
                {plan.cancellation ? "Allowed" : "Not Allowed"}
              </p>
            </div>
            <Link
              href="#"
              className="w-full text-center mt-4 inline-block bg-primary hover:bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
            >
              Invest Now
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DesiredPlans;
