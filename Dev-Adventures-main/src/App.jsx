import axios from "axios";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import Providers from "./Components/Providers/providers";
import "./index.css";
import About from "./Pages/AboutPage/About";
import CartPage from "./Pages/CartPage/CartPage";
import CourseDetailsPage from "./Pages/CoursePage/CourseDetailsPage/CourseDetailsPage";
import CoursesPage from "./Pages/CoursePage/CoursePage";
import HomePage from "./Pages/HomePage/HomePage";
import LessonDetailsPage from "./Pages/LessonPage/LessonDetailsPage/LessonDetailsPage";
import LessonPage from "./Pages/LessonPage/LessonPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import PlanPage from "./Pages/PlanPage/PlanPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import MyCoursePage from "./Pages/MyCoursesPage/MyCoursePage";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function App() {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      }}
    >
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
              <Route
                path="/courses/:courseId"
                element={<CourseDetailsPage />}
              />

              <Route
                path="/courses/:courseId/lessons"
                element={<LessonPage />}
              />

              <Route
                path="/courses/:courseId/lessons/:lessonId"
                element={<LessonDetailsPage />}
              />
              <Route path="about" element={<About />} />
              <Route path="mycourses" element={<MyCoursePage />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </Providers>
    </SWRConfig>
  );
}

export default App;
