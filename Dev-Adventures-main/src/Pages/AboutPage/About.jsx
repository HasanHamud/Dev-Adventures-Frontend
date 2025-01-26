import NavbarHomePage from "../../Components/Navigators/NavbarHomePage"
import Retard from "../../Assets/images/Retard.jpg"
import Retard2 from "../../Assets/images/Retard2.png"
import { Accordion, Placeholder } from "rsuite";
export default function About(){

return (
<div className=" bg-slate-900 min-h-screen text-white" >

<div>
<NavbarHomePage/>
</div>

<div className="flex relative top-0 text-white flex-col">
    <p className="text-5xl mx-auto font-bold p-5 rounded-md mt-12"> About Us </p>
    <p className="text-2xl mx-auto font-bold">Meet the team behind Dev Adventures</p>
</div>

<div className="flex flex-row justify-evenly mt-24 text-center">


<div>

    <img src={Retard} className="w-56 h-56 rounded-full"></img>
    <p className="text-white"> Malek Rizk </p>
    <p className="text-white"> Full-Stack Developer </p>

</div>

<div>
<img src={Retard2} className="w-56 h-56 rounded-full"></img>
    <p className="text-white"> Hasan Hammoud </p>
    <p className="text-white"> Full-Stack Developer </p>


</div>

</div>



<div>

<Accordion bordered>
    <Accordion.Panel header="Accordion Panel 1">
      <Placeholder.Paragraph />
    </Accordion.Panel>
    <Accordion.Panel header="Accordion Panel 2">
      <Placeholder.Paragraph />
    </Accordion.Panel>
    <Accordion.Panel header="Accordion Panel 3">
      <Placeholder.Paragraph />
    </Accordion.Panel>
    </Accordion>

</div>

</div>



)

}