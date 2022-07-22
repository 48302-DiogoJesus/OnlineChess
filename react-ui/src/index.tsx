// Import Pages
import MainPage from './pages/MainPage/MainPage'
import GamePage from './pages/GamePage/GamePage'
import LoginPage from './pages/Authentication/Login/Login'
import SignupPage from './pages/Authentication/Signup/Signup'

import ReactDOM from 'react-dom';

// Route Handling Imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import rootReducer from './state/reducers/root';

import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import NotFound from './pages/NotFound/NotFound';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Redux Store
export const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))

const persistor = persistStore(store)

const rootElement = document.getElementById('root')

ReactDOM.render(
  // Redux Provider
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/games/:game_id" element={<GamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  ,
  rootElement
);
