import { Route, Routes } from "react-router-dom";
import { Event } from "./pages/app";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Courses } from "./pages/courses";
import CoursePage from "./pages/coursePage"; // Importe a nova página do curso

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/curso/:id" element={<CoursePage />} /> {/* Rota do curso */}
            <Route path="/lesson/:slug" element={<Event />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-student" element={<Register />} />
            <Route path="/curses" element={<Courses />} />
        </Routes>
    );
}
