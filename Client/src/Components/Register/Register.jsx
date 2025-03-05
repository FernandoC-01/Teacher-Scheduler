import { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './register.css'
import logo_icon from '../Assets/logo.png'
import AlertMessage from '../AlertMessage/AlertMessage'

export default function LoginSignUp({ updateLocalStorage }) {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [alert, setAlert] = useState("")
    const navigate = useNavigate()

    const toggle = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAlert("");
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if(!firstName || !lastName || !email || !password || !confirmPassword ){
            return setAlert({ message: "Please complete all fields", type: "error"});
        }

        if(password !== confirmPassword) {
            setAlert({message: "Password does not match.", type: "error"})
            return;
        }

        
        const url = "http://127.0.0.1:4000/user-routes/register"

            const body = { firstName, lastName, email, password, confirmPassword }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })

        .then(res => {
            if (res.ok) {
                setAlert({message: "User created successfully! Redirecting to login...", type: "success"});
                setTimeout(() => navigate("/login", { state: { email } }), 3000)
            } else {
                setAlert({message: "This user is already in use.", type: "error"})
            }
            return res.json();
        })

        .then(data => updateLocalStorage(data.token))
}

    return ( 
    <div className="login-container">
        <div className="header">
            <img className="header-img" src={logo_icon} alt="WebKIDSS Logo" />
            <div className="text">Create new account</div>
        </div>

        {alert.message && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ message:"", type: ""})} />}


        <form action="" onSubmit={handleSubmit} className="login-inputs">
            <div className="input">
                <input onChange={e => setFirstName(e.target.value)} value={firstName} type="text" name="fName" placeholder="First Name" id="Fname" />
            </div>
            <div className="input">
                <input onChange={e => setLastName(e.target.value)} value={lastName} type="text" name="lName" placeholder="Last Name" id="Lname" />
            </div>
            <div className="input">
                <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder="Email" id="email" />
            </div>
            <div className="input">
                <input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" id="pwd" />
            </div>
            <div className="input">
                <input onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" placeholder="Confirm password"/>
            </div>
            <div className="submit-container">
                <input type="submit" className="toCreateAcc" onClick={handleSubmit} value="Sign Up" />
                <Link to="/login" type="submit" className="forgot-p" onClick={toggle}>
                    Already have an Account?
                </Link>
            </div>
        </form>
    </div>
    )
}