import React, { useState } from 'react';
import { encrypt, decrypt, isEncryptedData } from 'decrypt-core';
import { Toast, hooks, Field, Cell } from 'react-vant';
import { getAppKey, saveAppKey } from './common/storage';
import XTab from '../../components/Tab';

import './Encrypt.scss';

const Encrypt = () => {
  const [result, setResult] = useState("");
  const [appkey, setAppkey] = useState("");
  const [data, setData] = useState("{\na: 'a'\n}");
  const [type, setType] = useState("a");

  // 本地存储的 appkey 列表
  const [appkeyList, setAppkeyList] = useState([]);

  const loadAppkeyList = () => {
    getAppKey().then((keys) => {
      setAppkeyList(keys)
      setAppkey(keys[keys.length - 1] || "")
    }).catch((e) => {
      console.error(e)
    })
  }

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
        loadAppkeyList()
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

  hooks.useMount(loadAppkeyList);

  return (
    <div className='encrypt'>
      <XTab active={type} options={[
        { name: 'a', title: '加密' },
        { name: 'b', title: '解密' }
      ]} onUpdateActive={handleUpdateActive}></XTab>
      <select className="appkeyList mt-10 w-full" onChange={handleAppkeyChange}>
        <option value="">请选择秘钥</option>
        {
          appkeyList.map((key, index) => (
            <option value={key} key={key}>{index + 1}.{key}</option>
          ))
        }
      </select>
      <input className="appkey mt-10 w-full" type="text" name="appkey" placeholder="请填写秘钥" value={appkey} onChange={(e) => {
        setAppkey(e.target.value)
      }}/>
      <textarea className="data mt-10 w-full" name="data" id="" cols="30" rows="10" placeholder="请填写数据" value={data} onChange={(e) => {
        setData(e.target.value)
      }}></textarea>
      {resultStr && (
        <pre className="result mt-10 p-10">{resultStr}</pre>
      )}
      <button className="start mt-10 clearfix" onClick={handleButtonClick}>开始</button>
      <div className='encrypt-setion2'>
        <Cell.Group card>
          <Cell title="秘钥" label="请选择秘钥" isLink size="small">
            <div>{appkey}</div>
          </Cell>
          <Cell title="秘钥" label="请填写秘钥" size="small">
            <Field
              value={appkey}
              clearable
              required
              placeholder='请填写秘钥'
              onChange={setAppkey}
            ></Field>
          </Cell>
          <Cell title="数据" label="请填写数据" size="small">
            <Field
              type='textarea'
              autosize
              required
              clearable
              value={data}
              placeholder='请填写数据'
              onChange={setData}
            ></Field>
          </Cell>
        </Cell.Group>
      </div>
    </div>
  )
}

export default Encrypt;
