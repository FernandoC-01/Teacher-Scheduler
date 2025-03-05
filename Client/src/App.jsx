import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginSignUp from './Components/LoginSignUp/LoginSignUp'
import Register from './Components/Register/Register'
import Calendar from './Components/Calendar/Calendar'
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword"
import OTPValidation from "./Components/OTPvalidation/OTPvalidation"
import ResetPassword from "./Components/ResetPassword/ResetPassword"
// import ReactCalendar from './Components/React Calendar/ReactCalendar'
import { Button } from '@mui/material'
// import logo_icon




function App() {
  const [sessionToken, setSessionToken] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    }
    console.log(sessionToken)
  }, [sessionToken])

  const updateLocalStorage = newToken => {
    localStorage.setItem("token", newToken)
    setSessionToken(newToken)
  }

  const logoutUser = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token")
      setSessionToken(undefined)
    }
  }

  const router = createBrowserRouter([
    {
      path: "/login",
      element: sessionToken
        ? <Navigate to="/calendar" replace />
        : <LoginSignUp updateLocalStorage={updateLocalStorage}/>,
    },
    {
      path: "/register",
      element: sessionToken
        ?<Navigate to="/calendar" replace />
        :<Register updateLocalStorage={updateLocalStorage} />
    },
    {
      path: "/forgot-password",
      element: sessionToken
        ? <Navigate to="/calendar" />
        : <ForgotPassword />
    },
    {
      path: "/otp-validation",
      element: sessionToken
      ? <Navigate to="/calendar" />
      : <OTPValidation />
    },
    {
      path: "/reset-password",
      element: sessionToken
      ? <Navigate to="/calendar" />
      : <ResetPassword />
    },
    {
      path: "/calendar",
      element: sessionToken
        ? <div className="calendar-container">
          <div className="logout-container">
            <button className="logoutBttn" onClick={logoutUser}>Logout</button>
          </div>
          <Calendar sessionToken={sessionToken} />
        </div>
        : <Navigate to="/login" />,
    },
    {
      path: "*",
      element: <Navigate to={sessionToken ? "/calendar" : "/login"} replace />
    },
  ])

  return (
      <div>
        <RouterProvider router={router} />
      </div>
  )
}

export default App
