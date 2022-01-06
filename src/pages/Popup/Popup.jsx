import React, { useState, useEffect } from 'react';
import { encrypt, decrypt } from 'decrypt-core';
import XTab from '../../components/Tab';
import logo from '../../assets/img/logo.svg';
import './Popup.scss';

const Popup = () => {
  const [result, setResult] = useState("");
  const [appkey, setAppkey] = useState("1");
  const [data, setData] = useState("{\na: 'a'\n}");
  const [type, setType] = useState("a");

  const handleButtonClick = () => {
    if (appkey && data) {
      try {
        let _data = null
        switch(type) {
          case 'a':
            _data = encrypt(data, appkey)
            console.log('[debug] encrypt result', _data)
            break
          case 'b':
            _data = decrypt(data, appkey)
            console.log('[debug] decrypt result', _data)
            break
          default:
            break
        }
        // 测试用
        // if (Math.random() < 0.3) {
        //   throw new Error('加解密失败')
        // }
        setResult(_data)
      } catch (e) {
        setResult("")
        toast(e.message)
        console.error(e)
      }
    }
  }

  const handleUpdateActive = (name) => {
    setType(name)
  }

  const handleOpenClick = () => {
    console.log('sendMessage')
    chrome.runtime.sendMessage({
      action: 'open',
      url: 'https://yfzx.whty.com.cn/fakebank/'
    })
  }

  // TODO:
  const toast = (msg) => {
    msg && window.alert(msg)
  }

  const stringifyResult = (res) => {
    if (typeof res === 'string') {
      return res
    } else {
      return JSON.stringify(res, null, 2)
    }
  }

  const resultStr = stringifyResult(result)

  return (
    <div className="App">
      <XTab active={type} options={[
        { name: 'a', title: '加密' },
        { name: 'b', title: '解密' }
      ]} onUpdateActive={handleUpdateActive}></XTab>
      <input className="appkey mt-10 w-full" type="text" name="appkey" placeholder="请填写秘钥" value={appkey} onChange={(e) => {
        setAppkey(e.target.value)
      }}/>
      <textarea className="data mt-10 w-full" name="data" id="" cols="30" rows="10" placeholder="请填写数据" value={data} onChange={(e) => {
        setData(e.target.value)
      }}></textarea>
      {/* <input type="textarea" className="data" placeholder="请填写密文数据" /> */}
      {resultStr && (
        <pre className="result mt-10 p-10">{resultStr}</pre>
      )}
      <button className="start mt-10 clearfix" onClick={handleButtonClick}>开始</button>
    </div>
  );
};

export default Popup;
