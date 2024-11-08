import {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from './api/axios';
const LOGIN_URL = '/login/';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            username: "",
            password: "",
    });

    const { username, password } = formData;

    const [errMsg, setErrMsg] = useState('');

    const onChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate("/");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrMsg(err.response.data.message);
            } else {
                setErrMsg("An error occurred");
            }
        }
    }

    return (
            <section>
                <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Log in to IMAGEGALLERY</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        autoComplete="off"
                        value={username}
                        name="username"
                        required
                        onChange={onChange}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        required
                        onChange={onChange}
                    />
                <br/>
                <a href="/login">I forgot my password</a>
                    <button>Sign In</button>
                </form>
                <p>
                    <a>Not a member yet? </a>
                    <span className="line">
                        {}
                        <a href="/register">Sign up for free</a>
                    </span>
                </p>
            </section>
    )
}

export default Login