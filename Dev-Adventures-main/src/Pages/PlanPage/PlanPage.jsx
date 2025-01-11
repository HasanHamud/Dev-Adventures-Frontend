
import { PlanHeader } from "../../Components/PlansComponents/PlanHeader";
import { PlanCard } from "../../Components/PlansComponents/PlanCard"  

 function PlanPage() {
  const plans = [
    {
      level: "Beginner",
      title: "Programming Fundamentals",
      description: "Start your programming journey with essential fundamentals and core Java programming concepts.",
      duration: "3 months",
      price: 199.99,
      totalCourses: 3,
      totalHours: 40,
      courses: [
        "Introduction to Computer Science",
        "Java Programming Basics",
        "Problem Solving in Programming"
      ]
    },
    {
      level: "Intermediate",
      title: "Data Structures & Algorithms",
      description: "Master the essential computer science concepts with advanced problem-solving techniques.",
      duration: "4 months",
      price: 299.99,
      totalCourses: 4,
      totalHours: 60,
      courses: [
        "Data Structures Fundamentals",
        "Algorithms Analysis",
        "Advanced Problem Solving",
        "Competitive Programming"
      ]
    },
    {
      level: "Advanced",
      title: "Full Stack Development",
      description: "Become a complete developer with our comprehensive full stack development program.",
      duration: "6 months",
      price: 499.99,
      totalCourses: 5,
      totalHours: 100,
      courses: [
        "Frontend Development (React)",
        "Backend Development (Node.js)",
        "Database Management",
        "API Development",
        "DevOps & Deployment"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <PlanHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PlanCard key={plan.title} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default PlanPage;

