// subl3 source/app.js

import React from 'react';
import {render} from 'react-dom';
//require('font-awesome/css/font-awesome.css');
// import '../node_modules/font-awesome/css/font-awesome.min.css'; 

import { Main } from './Main.jsx';

class Hello extends React.Component {
    render() {
        return (
            <div>
            <Main />
            </div>
        );
    }
}

render(<Hello />, document.getElementById('root'));