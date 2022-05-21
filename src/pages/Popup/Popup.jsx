import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'react-vant';
import XHeader from '../../components/Header';
import XSideMenu from '../../components/SideMenu';
import Encrypt from './Encrypt';
import History from './History';
import KeyManage from './KeyManage';
import Favorite from './Favorite';

import './Popup.scss';

// const CONST_APPKEY_KEY = 'appkey';
const MESSAGE_LISTEN_TYPE = '36cfdd19__xtjk_decrypt_message';

const MENUS = [
  {
    name: 'encrypt',
    label: '加解密',
    to: true
  },
  {
    name: 'history',
    label: '历史记录',
    to: true
  },
  {
    name: 'keyManage',
    label: '秘钥管理',
    to: true
  },
  {
    name: 'favorite',
    label: '星标管理',
    to: true
  }
]

const handleSizeChange = (size) => {
  window.top.postMessage({ type: MESSAGE_LISTEN_TYPE, body: size }, '*')
}

const App = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/encrypt', { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='app'>
      <XHeader onSizeChange={handleSizeChange} />
      <div className='main'>
        <div className='menu'>
          <XSideMenu menus={MENUS} />
        </div>
        <div className='body'>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className='notfound'>
      <div className="info">404</div>
      <Button type='default' size='small' onClick={() => {
        navigate('/encrypt')
      }}>返回首页</Button>
    </div>
  )
}

const Popup = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="encrypt" element={<Encrypt />}></Route>
          <Route path="history" element={<History />}></Route>
          <Route path="keyManage" element={<KeyManage />}></Route>
          <Route path="favorite" element={<Favorite />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Popup;
