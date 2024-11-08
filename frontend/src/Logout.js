import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from './api/axios';

const LOGOUT_URL = '/logout/';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await axios.post(LOGOUT_URL, {}, {
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate("/");
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            } else {
                navigate("/login");
            }
        };

        logout();
    }, [navigate]);

    return null;
};

export default Logout;