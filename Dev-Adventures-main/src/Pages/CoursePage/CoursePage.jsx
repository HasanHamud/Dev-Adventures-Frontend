import { CourseCard } from "../../Components/CoursesComponents/CoursesCard";
import { CoursesHeader } from "../../Components/CoursesComponents/CoursesHeader";
import NavbarCoursePage from "../../Components/Navigators/NavbarCoursePage";

export default function CoursesPage() {
  const courses = [
    {
      level: "Beginner",
      rating: 4.8,
      title: "Introduction to Programming",
      description:
        "Learn the fundamentals of programming including variables, data types, control structures, and basic algorithms.",
      duration: "8 weeks",
      lessons: 12,
      language: "Java",
      price: 49.99,
    },
    {
      level: "Beginner",
      rating: 4.7,
      title: "Java Programming Basics",
      description:
        "Master Java syntax, object-oriented programming concepts, and build your first Java applications.",
      duration: "10 weeks",
      lessons: 15,
      language: "Java",
      price: 69.99,
    },
    {
      level: "Beginner",
      rating: 4.9,
      title: "Problem Solving in Java",
      description:
        "Develop your problem-solving skills through practical exercises and coding challenges using Java.",
      duration: "6 weeks",
      lessons: 10,
      language: "Java",
      price: 59.99,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <NavbarCoursePage />
      <CoursesHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
