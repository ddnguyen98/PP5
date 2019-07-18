import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as firebase from 'firebase';
import * as serviceWorker from './serviceWorker';

const config = {
    apiKey: "AIzaSyD2bxg_sJcq3m625n7tDHAp_nkMjGtUdOw",
    authDomain: "dogdata-3200f.firebaseapp.com",
    databaseURL: "https://dogdata-3200f.firebaseio.com",
    projectId: "dogdata-3200f",
    storageBucket: "dogdata-3200f.appspot.com",
    messagingSenderId: "1085718428729",
    appId: "1:1085718428729:web:b95fef7c3f7b8e31"
  };

firebase.initializeApp(config)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
