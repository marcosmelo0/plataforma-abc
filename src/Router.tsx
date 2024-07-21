import { Route, Routes } from "react-router-dom";
import { Event } from "./pages/Event";
import { Login } from "./components/Login";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Event />}/>
            <Route path="/lesson/:slug" element={<Event />}/>
            <Route path="/login" element={<Login />}/>
        </Routes>
    )
}