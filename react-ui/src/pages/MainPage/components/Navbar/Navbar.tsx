import './Navbar.css';

import AuthButtons from './AuthButtons/AuthButtons'

function Navbar() {
    return (
        <div className="main-page-navbar">
            <h2 className="main-page-header">Online Chess</h2>
            <AuthButtons />
        </div>
    )
}

export default Navbar