import './PlayerMenu.css'
import '../AuthButtons.css'
import State from '../../../../../../state/State'

export default function PlayerMenu(props: any) {
    const username = props.username

    function handleLogout() {
        State.logout()
    }

    return (
        <div className="btn-group">
            <button className="auth-button auth-playermenu-button dropdown-toggles" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {username}
            </button>
            <div className="dropdown-menu">
                <div className="inner-container">
                    <button className="dropdown-item btn">
                        Profile
                    </button>
                    <button className=" dropdown-item btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
