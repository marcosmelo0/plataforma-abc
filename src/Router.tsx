import { Route, Routes } from "react-router-dom";
import { Event } from "./pages/Event";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Courses from "./utils/curses";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Event />}/>
            <Route path="/lesson/:slug" element={<Event />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register-student" element={<Register />}/>
            <Route path="/curses" element={<Courses />}/>
        </Routes>
    )
}