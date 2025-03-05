import { useState, useEffect } from 'react'
import './alertMessage.css'

export default function AlertMessage({ message, type, onClose }) {

    const [visible, setVisible] = useState(true)

    useEffect (() => {
        const timer = setTimeout(() => {
            setVisible(false)
            onClose()
        }, 5000); // alert will auto-dismiss after 5 secs
        return () => clearTimeout(timer);
    }, [onClose]);

        if (!visible || !message) return null;
        

    return (
        <div className={`alert-container ${type === "success" ? "alert-success" : "alert-error"}`}>
            <span className='alert-message'>{message}</span>
            <button className="alert-close-btn" onClick={() => { setVisible(false); onClose(); }}>
                ✖
            </button>
        </div>
    )
}
