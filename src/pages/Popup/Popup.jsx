import React, { useState, useEffect } from 'react';
import { Toast } from 'react-vant';
import { encrypt, decrypt, isEncryptedData } from 'decrypt-core';
import XTab from '../../components/Tab';
import XSideMenu from '../../components/SideMenu';
import logo from '../../assets/img/logo.svg';
import './Popup.scss';

const CONST_APPKEY_KEY = 'appkey'
const MENUS = [
  {
    name: 'encrypt',
    label: '加解密'
  },
  {
    name: 'history',
    label: '历史记录'
  },
  {
    name: 'keyManage',
    label: '秘钥管理'
  },
  {
    name: 'favorite',
    label: '星标管理'
  }
]

function saveAppKey(appkey) {
  const APPKEY_KEY = CONST_APPKEY_KEY
  return new Promise((resolve, reject) => {
    if (appkey) {
      chrome.storage.sync.get({
        [APPKEY_KEY]: []
      }, (result) => {
        console.log(result)
        let keys = result[APPKEY_KEY]
        if (!keys.includes(appkey)) {
          keys = [...keys, appkey]
        }
        console.log('[debug] keys', keys)
        chrome.storage.sync.set({
          [APPKEY_KEY]: keys
        }, () => {
          resolve()
        })
      })
    } else {
      resolve()
    }
  })
}

function getAppKey() {
  const APPKEY_KEY = CONST_APPKEY_KEY
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({
      [APPKEY_KEY]: []
    }, (result) => {
      let keys = result[APPKEY_KEY]
      console.log('[debug] getAppKey keys', keys)
      resolve(keys)
    })
  })
}

const Popup = () => {
  const [result, setResult] = useState("");
  const [appkey, setAppkey] = useState("");
  const [data, setData] = useState("{\na: 'a'\n}");
  const [type, setType] = useState("a");

  // 本地存储的 appkey 列表
  const [appkeyList, setAppkeyList] = useState([]);

  const refreshAppkeyList = () => {
    getAppKey().then((keys) => {
      setAppkeyList(keys)
      setAppkey(keys[keys.length - 1] || "")
    }).catch((e) => {
      console.error(e)
    })
  }

  useEffect(refreshAppkeyList, [])

  const handleButtonClick = () => {
    if (type === 'b' && !isEncryptedData(data)) {
      Toast('要解密的数据不符合加密数据格式，请检查')
      return
    }
    if (appkey && data) {
      saveAppKey(appkey)
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
        refreshAppkeyList()
      } catch (e) {
        setResult("")
        toast(e.message, '加解密报错')
        console.error(e)
      }
    }
  }

  const handleUpdateActive = (name) => {
    setType(name)
  }

  const handleAppkeyChange = (e) => {
    const appkey = e.target.value
    if (appkey) {
      setAppkey(appkey)
    }
  }

  const handleOpenClick = () => {
    console.log('sendMessage')
    chrome.runtime.sendMessage({
      action: 'open',
      url: 'https://yfzx.whty.com.cn/fakebank/'
    })
  }

  // TODO:
  const toast = (msg, title = '提示') => {
    msg && window.alert(`${title}\n${msg}`)
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
      <header>
        <XTab active={type} options={[
          { name: 'a', title: '加密' },
          { name: 'b', title: '解密' }
        ]} onUpdateActive={handleUpdateActive}></XTab>
      </header>
      <div style={{ width: '100px' }}>
        <XSideMenu menus={MENUS} />
      </div>
      <select className="appkeyList mt-10 w-full" onChange={handleAppkeyChange}>
        <option value="">请选择秘钥</option>
        {
          appkeyList.map((key, index) => (
            <option value={key}>{index + 1}.{key}</option>
          ))
        }
      </select>
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
