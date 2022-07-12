import './AuthButtons.css';

import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../../../../state/reducers/root'
import { useNavigate } from "react-router-dom";

import PlayerMenu from './PlayerMenu/PlayerMenu';
import State from '../../../../../state/State';

function AuthButtons() {
    const navigate = useNavigate()

    const username = useSelector((state: AppState) => state).authentication.username

    function handleLogin() {
        navigate("/login")
    }

    function handleLogout() {
        State.logout()
    }

    return (
        <div>
            {
                username !== null ?
                    <>
                        <PlayerMenu username={username} />
                    </>
                    :
                    <>
                        <button className="auth-button auth-login-button" onClick={handleLogin}>
                            Log In
                        </button>
                    </>
            }
        </div>
    )
}

export default AuthButtons