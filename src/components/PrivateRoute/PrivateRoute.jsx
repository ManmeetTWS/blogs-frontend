import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData) {
            toast.error("You need to login first");
            navigate("/login");
        }
        setLoading(false);
    }, [userData, navigate]);

    if (loading) {
        return <p>Loading . . .</p>; // Or some loading indicator if needed
    }

    return userData ? children : null;
};


export const UnprotectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {
        if (userData) {
            navigate("/blogApp");
        }
    }, [userData, navigate]);

    return children;
};