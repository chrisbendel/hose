import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import isElectron from 'is-electron';

ReactDOM.render(<App />, document.getElementById('root'));

if (isElectron()) {
  registerServiceWorker();
  const Nucleus = window.require('electron-nucleus');
  Nucleus.init('5a25ab8246d5e3641a3ef40a', true);
}
