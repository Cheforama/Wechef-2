import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory, LocationProvider } from '@reach/router';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { Provider } from "react-redux";

import store from './store';
import "./assets/animated.css";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/elegant-icons/style.css';
import '../node_modules/et-line/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './assets/style.scss';
import './index.css';
import App from './components/app';
import * as serviceWorker from './serviceWorker';

function getLibrary(provider) {
	return new Web3(provider)
}

ReactDOM.render(
	<Provider store={store}>
		<LocationProvider history={createHistory(window)}>
			<Web3ReactProvider getLibrary={getLibrary}>
				<App />
			</Web3ReactProvider>
		</LocationProvider>
	</Provider>,
	document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();