export const doLogin = (username: string, token: string) => {
    return {
        type: 'LOGIN',
        payload: {
            'username': username,
            'token': token
        }
    }
}

// Currently not being used
export const doLogout = () => {
    // To remove the session cookie
    // Server.logout()
    return {
        type: 'LOGOUT',
        payload: {}
    }
}

export const clearState = () => {
    return {
        type: 'CLEAR_STATE',
        payload: {}
    }
}

const Actions = {
    doLogin,
    doLogout,

    clearState
}

export default Actions