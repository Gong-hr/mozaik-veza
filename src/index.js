import React from 'react';
import ReactDOM from 'react-dom'
import './styles/custom_bootstrap.css'
import './index.css'
import App from './App'
//import registerServiceWorker from './registerServiceWorker';
import { loadState, saveState} from './localStorage'
import throttle from 'lodash/throttle'
import { loadingBarReducer } from 'react-redux-loading-bar'
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import ReactGA from 'react-ga'
import { ga_trackingID } from "./config"
/*
* The service worker is a web API that helps you cache your assets and other files so that when the user is offline or on slow network,
* he/she can still see results on the screen, as such, it helps you build a better user experience, that's what you should know about
* service worker's for now. It's all about adding offline capabilities to your site.
* React creates a service worker for you without your configuration by default.
*
* from: https://stackoverflow.com/questions/47953732/what-does-registerserviceworker-do-in-react-js
* */


//import reducer from './reducers';
import rootReducer from './reducers/index.js'
import { unregister } from './registerServiceWorker';

import { createStore, applyMiddleware, combineReducers  } from 'redux'
import thunkMiddleware from 'redux-thunk'
//import promiseMiddleware from 'redux-promise-middleware'

export const persistedState = loadState();

if(ga_trackingID !== undefined && ga_trackingID !== "") {
    ReactGA.initialize(ga_trackingID,{
        gaOptions: {
            storage: 'none',
            anonymizeIp: 'true'
        }
    });
}

function configureStore(preloadedState) {
    return createStore(
        combineReducers({
            rootReducer: rootReducer,
            loadingBar: loadingBarReducer
        }),
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            //promiseMiddleware(),
            loadingBarMiddleware(), // manages loading bar
        ),
        persistedState
    )
}

export const store = configureStore();
//export const store = createStore(rootReducer);

store.subscribe(throttle(() => {
    saveState({
        activeUser: store.getState().rootReducer.reducer.activeUser
    });
}, 1000));
 
ReactDOM.render(
    <App store={store} />,
  document.getElementById('root')
);

//ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
unregister(); //preventing cache: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#opting-out-of-caching
