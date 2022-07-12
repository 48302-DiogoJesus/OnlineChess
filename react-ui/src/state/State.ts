import Actions from './actions/action'
import { store as Store } from '../index'
import { AppState } from './reducers/root'

export function getAppState(): AppState {
    return Store.getState()
}

/* export function joinGame(
    game_id: string,
    // callback: (success: boolean, game: RemoteGame | null, original_response: ServerResponse) => void
): Promise<ServerResponse> {
    // Since we are joining a new game 
    Store.dispatch(Actions.leaveGame())

    return new Promise((resolve, reject) => {
        Store.dispatch(function (dispatch: any, getState: any) {
            Server.getGame(game_id)
                .then((response: ServerResponse) => {
                    // Game Exists
                    if (response.success) {
                        const gameObject = response.data as RemoteGame
                        dispatch(Actions.joinGame(gameObject))
                    }
                    resolve(response)
                })
        })
    })
} */

export function login(username: string, token: string) {
    Store.dispatch(Actions.doLogin(username, token))
}

export function logout() {
    Store.dispatch(Actions.clearState())
}

export function clearState() {
    Store.dispatch(Actions.clearState())
}

const State = {
    getAppState,
    login,
    logout,
}

export default State