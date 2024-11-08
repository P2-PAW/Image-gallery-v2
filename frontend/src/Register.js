import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{2,9}$/;
const PWD_REGEX = /^.{6,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = '/register/';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            username: "",
            email: "",
            password: "",
            password2: "",
    });

    const { username, email, password, password2 } = formData;

    const [validEmail, setValidEmail] = useState(false);
    const [validName, setValidName] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState('');

     const onChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
     };
     useEffect(() => {
         setValidEmail(EMAIL_REGEX.test(email));
         setValidName(USER_REGEX.test(username));
         setValidPassword(PWD_REGEX.test(password));
         setValidMatch(password === password2);
         }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v0 = EMAIL_REGEX.test(email);
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v0 || !v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL, formData);
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
            <h1>Register in IMAGEGALLERY</h1>
            <form onSubmit={handleSubmit}>
            <label htmlFor="email">
                    E-mail
                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                </label>
                <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    value={email}
                    name="email"
                    onChange={onChange}
                    required
                    aria-invalid={validEmail ? "false" : "true"}

                />
                <label htmlFor="username">
                    Username
                    <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validName || !username ? "hide" : "invalid"} />
                </label>
                <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    value={username}
                    name="username"
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onChange={onChange}
                />
                <p id="uidnote" className={username && !validName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    3 to 10 characters. Must start with a letter.
                </p>


                <label htmlFor="password">
                    Password
                    <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    name="password"
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onChange={onChange}
                />
                <p id="pwdnote" className={!validPassword ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    6 to 24 characters.
                </p>


                <label htmlFor="confirm_pwd">
                    Confirm Password
                    <FontAwesomeIcon icon={faCheck} className={validMatch && password2 ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatch || !password2 ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="password2"
                    value={password2}
                    name="password2"
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onChange={onChange}
                />
                <p id="confirmnote" className={!validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>

                <button disabled={!validName || !validPassword || !validMatch || !validEmail ? true : false}>Sign Up</button>
            </form>
            <p>
                <a>Already registered? </a>
                <span className="line">
                    {}
                    <a href="/login">Sign in</a>
                </span>
            </p>
        </section>
    )
}

export default Register