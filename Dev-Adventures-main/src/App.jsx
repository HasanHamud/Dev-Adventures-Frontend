import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import Providers from "./Components/Providers/providers";
import CoursesPage from "./Pages/CoursePage/CoursePage";
import PlanPage from "./Pages/PlanPage/PlanPage";
import CartPage from "./Pages/CartPage/CartPage";
import LessonPage from "./Pages/LessonPage/LessonPage";
import "./index.css";
import CourseDetailsPage from "./Pages/CoursePage/CourseDetailsPage/CourseDetailsPage";

function App() {
  return (
    <Providers>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="plans" element={<PlanPage />} />
            <Route path="courses/details" element={<CourseDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="lesson" element={<LessonPage />} />


          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </Providers>
  );
}

export default App;
