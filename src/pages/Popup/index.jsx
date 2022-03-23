import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';

import '@vant/touch-emulator';

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
