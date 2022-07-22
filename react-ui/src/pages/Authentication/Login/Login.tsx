import './Login.css'
import '../Authentication.css'
import '../../../global-css/sweetalert.css'

import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import State from '../../../state/State'
import Server from '../../../server/server'

import Alerts from '../../../utils/Alerts/sa-alerts'

export default function Login(props: any) {
    const username: any = useRef()
    const password: any = useRef()
    const navigate = useNavigate()

    const handleLogin = async () => {
        const usernameValue = username.current.value
        const passwordValue = password.current.value
        if (usernameValue.length === 0 || passwordValue.length === 0)
            return
        const response = await Server.tryLogin(usernameValue, passwordValue)
        if (response.success) {
            const token = response.data.token
            State.login(usernameValue, token)
            Alerts.showNotification("Success!", 1).then(() => navigate('/'))
        }
    }

    return (
        <div className="global-container">
            <div className="auth-container">
                <h1>LOGIN</h1>
                <form>
                    <label htmlFor="auth-username">USERNAME</label>
                    <input ref={username} type="text" className="auth-input" id="auth-username" name="username" /><br />

                    <label htmlFor="auth-password">PASSWORD</label>
                    <input ref={password} type="password" className="auth-input" id="auth-password" name="password" onKeyDown={e => { if (e.key === "Enter") handleLogin() }} /><br />

                    <input id="auth-button" value="LOGIN" onClick={handleLogin} />
                    <a className="signup-link" href="/signup">Don't have an account yet? Click here.</a>
                </form>
            </div>
        </div>
    )
}
