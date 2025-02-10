/* eslint-disable no-unused-vars */
import Navbar from "../../Components/Navigators/Navbar";
import Retard from "../../Assets/images/Retard.jpg";
import Retard2 from "../../Assets/images/Retard2.png";
import FactCard from "../../Components/AboutComponents/FactCard";
export default function About() {
  return (
    <div className=" bg-slate-900 min-h-screen text-white">
      <div>
        <Navbar />
      </div>

      <div className="flex relative top-0 text-white flex-col mt-6">
        <p className="text-5xl mx-auto font-bold p-5 rounded-md mt-8">
          {" "}
          About Us{" "}
        </p>
        <p className="text-2xl mx-auto font-bold">
          Meet the team behind Dev Adventures
        </p>
      </div>

      <div className="flex flex-row justify-evenly mt-24 text-center">
        <div>
          <img src={Retard} className="w-56 h-56 rounded-t-lg"></img>
          <p className="text-white bg-slate-800 border-slate-800 border">
            {" "}
            Malek Rizk{" "}
          </p>
          <p className="text-white bg-slate-800 border-slate-800 border rounded-b-md">
            {" "}
            Full-Stack Developer{" "}
          </p>
        </div>

        <div>
          <img src={Retard2} className="w-56 h-56 rounded-t-lg"></img>
          <p className="text-white bg-slate-800 border-slate-800 border">
            {" "}
            Hasan Hammoud{" "}
          </p>
          <p className="text-white bg-slate-800 border-slate-800 border rounded-b-md">
            {" "}
            Full-Stack Developer{" "}
          </p>
        </div>
      </div>

      <div className="flex flex-row justify-evenly mt-10">
        <FactCard
          title={"Where it started"}
          content={
            "Dev Adventures started as a university passion project by Malek Rizk and Hassan Hammoud in the aim to improve their skills at web development"
          }
        />
        <FactCard
          title={"What is our Goal?"}
          content={
            "We hope to help every student struggling in their journey of learning, we believe everyone deserves a chance to thrive in the world of programming"
          }
        />
        <FactCard
          title={"What to expect"}
          content={
            "Our website contains accessible courses from all different kinds of fields, albeit professional or beginner level, you will find something that suits you "
          }
        />
      </div>
      <div className="text-white w-90 text-xl flex items-center justify-center mx-auto">
        {/* <Accordion>
      <AccordionItem header="What is Lorem Ipsum?" className="bg-gray-900 border-t-blue-500 border-t transition-colors hover:bg-black rounded-sm py-3">
        Answer 1
      </AccordionItem>

      <AccordionItem header="Where does it come from?" className="bg-gray-900 border-t-blue-500 border-t hover:bg-black rounded-sm py-3" >
      Answer 1

      </AccordionItem>

      <AccordionItem header="Why do we use it?" className="bg-gray-900 border-t-blue-500 border-t border-b-blue-500 border-b hover:bg-black rounded-sm py-3">
      Answer 1

      </AccordionItem>
    </Accordion> */}
      </div>
    </div>
  );
}
