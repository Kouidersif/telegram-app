import { Navigate, Outlet } from "react-router-dom";
import { getUserToken } from "../lib/helper";



export const IsAuthenticated = () => {
    const token = getUserToken();
    if(!token) return <Navigate to="/login" />;
    return <Outlet />
}

