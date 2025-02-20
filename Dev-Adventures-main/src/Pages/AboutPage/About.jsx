/* eslint-disable no-unused-vars */
import Navbar from "../../Components/Navigators/Navbar";
import Retard from "../../Assets/images/Retard.jpg";
import Retard2 from "../../Assets/images/Retard2.png";
import FactCard from "../../Components/AboutComponents/FactCard";

export default function About() {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Navbar />

      <div className="text-center pt-32">
        <h1 className="text-5xl font-bold">About Us</h1>
        <p className="text-2xl font-semibold mt-4">
          Meet the team behind Dev Adventures
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-12 mt-16">
        <div className="text-center">
          <img
            src={Retard}
            alt="Malek Rizk"
            className="w-[320px] h-[213px] rounded-t-lg"
          />
          <p className="bg-slate-800 py-2 font-semibold">Malek Rizk</p>
          <p className="bg-slate-700 py-2 rounded-b-md">Full-Stack Developer</p>
        </div>

        <div className="text-center">
          <img
            src={Retard2}
            alt="Hasan Hammoud"
            className="w-[320px] h-[213px] rounded-t-lg"
          />
          <p className="bg-slate-800 py-2 font-semibold">Hasan Hammoud</p>
          <p className="bg-slate-700 py-2 rounded-b-md">Full-Stack Developer</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 px-8 md:px-24 mt-16">
        <FactCard
          title="Where it started"
          content="Dev Adventures started as a university passion project by Malek Rizk and Hasan Hammoud to enhance their web development skills."
        />
        <FactCard
          title="What is our Goal?"
          content="We aim to help students struggling in their programming journey, believing that everyone deserves a chance to thrive."
        />
        <FactCard
          title="What to expect"
          content="Our website offers accessible courses across different fields, whether professional or beginner level, ensuring there's something for everyone."
        />
      </div>
    </div>
  );
}
