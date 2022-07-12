export interface AppState {
    authentication: Authentication
}

export interface Authentication {
    isAuthenticated: boolean,
    username: string | null,
    token: string | null
}

const initialState: AppState = {
    authentication: {
        isAuthenticated: false,
        username: null,
        token: null
    },
}

export default function rootReducer(state: AppState = initialState, action: any): AppState {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                authentication: {
                    isAuthenticated: true,
                    username: action.payload.username,
                    token: action.payload.token
                }
            }
        case 'LOGOUT':
            return {
                authentication: {
                    isAuthenticated: false,
                    username: null,
                    token: null
                }
            }
        case 'CLEAR_STATE':
            return initialState
        default:
            return state
    }
}