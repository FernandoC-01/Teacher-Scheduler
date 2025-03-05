import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo_icon from '../Assets/logo.png'
import AlertMessage from '../AlertMessage/AlertMessage'

export default function ForgotPassword() {

    const [email, setEmail] = useState("")
    const [alert, setAlert] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = "http://127.0.0.1:4000/user-routes/forgot-password"
            const body = { email }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            })
            .then(res => {
                if (res.ok) {
                    setAlert({message: "OTP sent! Check your email.", type: "success"});
                    setTimeout(() => { navigate("/otp-validation", { state: { email } }); }, 2000)
                } else {
                    setAlert({message: "Invalid email!", type: "error"})
                }
                return res.json();
            })
        } catch (err) {
            setAlert({message: `Server error. Try again: ${err}`, type: "error"})
        }
    }

    return (
        <div className="login-container">
            <div className="header">
                <img className="header-img" src={logo_icon} alt="WebKIDSS Logo" />
                <div className="text">Forgot Password</div>
            </div>

            {alert.message && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ message:"", type: ""})} />}

            <form action="" onSubmit={handleSubmit} className="login-inputs">
                <div className="input">
                    <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event)=> setEmail(event.target.value)}
                    required
                    />
                </div>
                <div className="submit-container">
                    <input type="submit" className="submit" value="Send OTP" onClick={handleSubmit} />
                </div>
            </form>
    </div>
    )
};