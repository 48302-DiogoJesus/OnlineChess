import './Signup.css'
import '../Authentication.css'

import { useRef } from "react";
// import { useNavigate } from "react-router-dom";

import State from '../../../state/State'
import Server from '../../../server/server'

import Alerts from '../../../utils/Alerts/sa-alerts'

export default function Signup(props: any) {
    const username: any = useRef()
    const password: any = useRef()
    // const navigate = useNavigate()

    const handleSignup = async () => {
        const usernameValue = username.current.value
        const passwordValue = password.current.value
        if (usernameValue.length === 0 || passwordValue.length === 0)
            return
        const response = await Server.trySignup(usernameValue, passwordValue)
        if (response.success) {
            Alerts.showNotification('Account Created. You can login now.')
        }
    }

    return (
        <div className="global-container">
            <div className="auth-container">
                <form>
                    <label htmlFor="auth-username">USERNAME</label>
                    <input ref={username} type="text" className="auth-input" id="auth-username" name="username" /><br />

                    <label htmlFor="auth-password">PASSWORD</label>
                    <input ref={password} type="password" className="auth-input" id="auth-password" name="password" onKeyDown={e => { if (e.key === "Enter") handleSignup() }} /><br />

                    <input id="auth-button" value="SIGNUP" onClick={handleSignup} />
                    <a className="login-link" href="/login">Already have an account? Click here.</a>
                </form>
            </div>
        </div>
    )
}
