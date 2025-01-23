import Lesson from "../../Components/LessonComponents/Lesson"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
export default function LessonPage(){
const numbers = [1,2,3,4,5,6,7,8,9,10];
return(

<div className="min-h-screen  bg-gray-900 overflow-hidden">

<h1 className="text-4xl text-white text-center font-bold pt-4"> Course Title </h1>

<div className="flex items-center space-x-4 min-w-max px-4 py-8 text-center justify-center min-h-screen">


{numbers.map((number) => (
    
<div className="flex flex-col gap-10">

<div className="flex flex-row items-center space-x-4">

    <Lesson key={number} number={number}/>

    { number != numbers.length && (<div className="text-blue-500"><p> <FontAwesomeIcon icon={faArrowRight} /> </p></div>)}        

    </div>

    <div className="flex flex-row items-center space-x-4">

<Lesson key={number} number={number}/>

{ number != numbers.length && (<div className="text-blue-500"><p> <FontAwesomeIcon icon={faArrowRight} /> </p></div>)}        

</div>


</div>

    
   
))}




</div>







</div>





)

}