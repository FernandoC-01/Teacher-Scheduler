import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import logo_icon from '../Assets/logo.png'
import AlertMessage from "../AlertMessage/AlertMessage";
import './otpvalidation.css'

export default function OTPvalidation() {
    const [otp, setOTP] = useState("");
    const [alert, setAlert] = useState("");
    // const [timer, setTimer] = useState(0);
    // const [resend, setResend] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showResend, setShowResend] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        // Fetch OTP expiration time from the backend when the component mounts
        fetch(`http://127.0.0.1:4000/user-routes/get-otp-expiration?email=${email}`)
            .then(res => res.json())
            .then(data => {
                const expirationTime = new Date(data.expiration).getTime();
                const currentTime = new Date().getTime();
                const remainingTime = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
                setTimeLeft(remainingTime);
                if (remainingTime === 0) setShowResend(true);
            })
            .catch(() => setAlert({message: "Failed to fetch OTP expiration.", type: "error"}));
    }, [email]);

    useEffect(() => {
        if (timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        setShowResend(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timeLeft]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = "http://127.0.0.1:4000/user-routes/otp-validation"
            const body = { email, otp }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            })
            .then(res => {
                if (res.ok) {
                    setAlert({message: "OTP Verified! Redirecting...", type: "success"});
                    setTimeout(() => { navigate("/reset-password", { state: { email } }); }, 3000)
                } else {
                    setAlert({message: "Invaild OTP!", type: "error"})
                }
                return res.json();
            })
            

        } catch (err) {
            setAlert({message: `Server error. Try again later: ${err}`, type: "error"})
        };
    }

    const handleResendOtp = async () => {
        setShowResend(false);
        setAlert({message: "Resending OTP...", type: "success"});
        try {
            const res = await fetch("http://127.0.0.1:4000/user-routes/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setAlert({message: "New OTP sent. Check your email.", type: "success"});
                setTimeLeft(60); // Reset countdown
            } else {
                setAlert({message: data.err || "Failed to resend OTP.", type: "error"});
                setShowResend(true);
            }
        } catch (err) {
            setAlert({message: `Error resending OTP: ${err}`, type: "error"});
            setShowResend(true);
        }
    };
    

    return (
        <div className="login-container">
            <div className="header">
                <img className="header-img" src={logo_icon} alt="WebKIDSS Logo" />
                <div className="text">OTP Verification</div>
            </div>

            {alert.message && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ message:"", type: ""})} />}

            <form action="" onSubmit={handleSubmit} className="login-inputs">
                <div className="input">
                    <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(event)=> setOTP(event.target.value)}
                    required
                    />
                </div>
                <div className="submit-container">
                    <input  type="submit" className="submit" value="Submit OTP" onClick={handleSubmit} />
                </div>
            </form>
            <div className="submit-container">
            <p className="otp-timer">Time Left: {timeLeft} seconds</p>
            {showResend && <button className="resend-btn" onClick={handleResendOtp}>Resend OTP</button>}
            </div>
    </div>
    )
};