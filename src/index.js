import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
const Nucleus = window.require('electron-nucleus');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
Nucleus.init('5a25ab8246d5e3641a3ef40a', true);
