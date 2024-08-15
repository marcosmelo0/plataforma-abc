import { Route, Routes } from "react-router-dom";
import { Event } from "./pages/app";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Courses } from "./pages/courses";
import CoursePage from "./pages/coursePage";
import {Report}  from "./pages/report";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/curso/:id" element={<CoursePage />} /> 
            <Route path="/lesson/:slug" element={<Event />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-student" element={<Register />} />
            <Route path="/curses" element={<Courses />} />
            <Route path="/report" element={<Report />} />
        </Routes>
    );
}
