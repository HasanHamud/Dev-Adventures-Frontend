import axios from "axios";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import Providers from "./Components/Providers/providers";
import "./index.css";
import CartPage from "./Pages/CartPage/CartPage";
import CourseDetailsPage from "./Pages/CoursePage/CourseDetailsPage/CourseDetailsPage";
import CoursesPage from "./Pages/CoursePage/CoursePage";
import HomePage from "./Pages/HomePage/HomePage";
import LessonPage from "./Pages/LessonPage/LessonPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import PlanPage from "./Pages/PlanPage/PlanPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import About from "./Pages/AboutPage/About";

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
              <Route path="lesson" element={<LessonPage />} />
              <Route path="about" element={<About />} />

            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </Providers>
    </SWRConfig>
  );
}

export default App;
