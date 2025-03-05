import { useState} from 'react'
import { Link } from 'react-router-dom'
import './loginSignUp.css'
import logo_icon from '../Assets/logo.png'
import AlertMessage from '../AlertMessage/AlertMessage'

export default function LoginSignUp({ updateLocalStorage }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState("")

    const toggle = () => {
        setEmail("");
        setPassword("");
        setAlert("");
    }    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            return setAlert({ message: "Please fill in all fields", type: "error" });
        }

        const url = "http://127.0.0.1:4000/user-routes/login"

            const body = { email, password }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            })

            .then(res => {
                if (res.ok) {
                    setAlert({message: "Login successful", type: "success"});
                } else {
                    setAlert({message: "User not found", type: "error"})
                }
                return res.json();
            })

            .then(data => updateLocalStorage(data.token))
    }

    return ( 
    <div className="login-container">
        <div className="header">
            <img className="header-img" src={logo_icon} alt="WebKIDSS Logo" />
            <div className="text">Login</div>
        </div>

        {alert.message && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ message:"", type: ""})} />}

        <form action="" onSubmit={handleSubmit} className="login-inputs">
            <div className="input">
                <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder="Email" id="email" />
            </div>
            <div className="input">
                <input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" id="pwd" />
            </div>
            <div className="submit-container">
                <input type="submit" className="submit" onClick={handleSubmit} value="Login" />
                <Link to="/forgot-password" type="submit" className="forgot-p">
                    Forgot Password?
                </Link>
                <div className='divider'>──────── or ────────</div>
                <Link to="/register" type="submit" className="toCreateAcc" onClick={toggle}>
                    Create account
                </Link>
            </div>
        </form>
    </div>
    )
}
