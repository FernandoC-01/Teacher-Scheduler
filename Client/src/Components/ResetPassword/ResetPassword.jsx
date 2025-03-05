import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo_icon from '../Assets/logo.png'
import AlertMessage from '../AlertMessage/AlertMessage'

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [alert, setAlert] = useState("")
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(newPassword !== confirmPassword) {
            setAlert({message: "Password does not match.", type: "error"})
            return;
        }

        try {
            const url = "http://127.0.0.1:4000/user-routes/reset-password"
            const body = { email, newPassword, confirmPassword }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            })

            .then(res => {
                if (res.ok) {
                    setAlert({message: "Password successfully reset! Redirecting to login...", type: "success"});
                    setTimeout(() => navigate("/login", { state: { email } }), 3000)
                } else {
                    setAlert({message: `Something went wrong. Try Again`, type: "error"})
                }
                return res.json();
            })
            
            
        } catch (err) {
            setAlert({message: `Server error. Try again later: ${err}`, type: "error"})
        }
    };

    return (
        <div className="login-container">
            <div className="header">
                <img className="header-img" src={logo_icon} alt="WebKIDSS Logo" />
                <div className="text">Enter New Password</div>
            </div>

            {alert.message && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ message:"", type: ""})} />}
            
            <form action="" onSubmit={handleSubmit} className="login-inputs">
                <div className="input">
                    <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(event)=> setNewPassword(event.target.value)}
                    required
                    />
                </div>
                <div className="input">
                    <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(event)=> setConfirmPassword(event.target.value)}
                    required
                    />
                </div>
                <div className="submit-container">
                    <input type="submit" className="submit" value="Reset Password" onClick={handleSubmit} />
                </div>
            </form>
        {/* {message && <p className="text-red-500 mt-2">{message}</p>} */}
    </div>
    )
}
