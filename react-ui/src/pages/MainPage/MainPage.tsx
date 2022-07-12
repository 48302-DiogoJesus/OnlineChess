import './MainPage.css';
import { useSelector } from 'react-redux'
import { AppState } from '../../state/reducers/root'

import Navbar from './components/Navbar/Navbar'
import OpenMPGame from './components/OpenMPGame/OpenMPGame'
import OpenSPGame from './components/OpenSPGame/OpenSPGame';

export default function MainPage(props: any) {

  const username: string | null = useSelector((state: AppState) => state).authentication.username

  /*
  function renderLoginIfNotLogged() {
    if (username == null)
      return <Navigate to="/login" replace />
  }

  Inside Return Div Container: {renderLoginIfNotLogged()}
  */
  return (
    <div>
      <Navbar />
      <div className="container main-page-contents" >
        <div className="row justify-content-md-center">
          <div className="col open-game-outer-container">
            <OpenMPGame />
          </div>
          <div className="col open-game-outer-container">
            <OpenSPGame />
          </div>
        </div>
      </div>
    </div>
  );
}
