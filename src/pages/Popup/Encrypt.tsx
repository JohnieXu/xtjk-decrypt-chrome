import React, { useState } from 'react';
import { encrypt, decrypt, isEncryptedData } from 'decrypt-core';
import { Toast, hooks, Field, Cell, Popup, Picker, Button, Tabs } from 'react-vant';
import {
  getAppKey,
  saveAppKey,
  convertHistory,
  EncryptHistoryItem,
  DecryptHistoryItem
} from './common/storage';
import { genId, getNow } from './common/utils';

import './Encrypt.scss';

const Encrypt = () => {
  const [result, setResult] = useState("");
  const [appkey, setAppkey] = useState("");
  const [data, setData] = useState("{\na: 'a'\n}");
  const [type, setType] = useState<string>("a");
  const [showAppkeyPicker, setShowAppkeyPicker] = useState(false);

  // 本地存储的 appkey 列表
  const [appkeyList, setAppkeyList] = useState([]);

  const loadAppkeyList = (setLast: boolean) => {
    getAppKey().then((keys) => {
      setAppkeyList(keys as any)
      if (setLast) {
        setAppkey(keys[keys.length - 1] || "")
      }
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
        let encryptItem: EncryptHistoryItem
        let decryptItem: DecryptHistoryItem
        switch(type) {
          case 'a':
            _data = encrypt(data, appkey)

            encryptItem = {
              id: genId(),
              date: getNow(),
              from: data,
              key: appkey,
              to: _data
            }
            convertHistory.addEncrypt(encryptItem)
            console.log('[debug] encrypt result', _data)
            break
          case 'b':
            _data = decrypt(data, appkey)

            decryptItem = {
              id: genId(),
              date: getNow(),
              from: data,
              key: appkey,
              to: _data
            }
            convertHistory.addDecrypt(decryptItem)
            console.log('[debug] decrypt result', _data)
            break
          default:
            break
        }
        // 测试用
        // if (Math.random() < 0.3) {
        //   throw new Error('加解密失败')
        // }
        setResult(_data as any)
        loadAppkeyList(false)
      } catch (e) {
        setResult("")
        toast((e as any).message, '加解密报错')
        console.error(e)
      }
    }
  }

  const handleUpdateActive = (name: string | number, title: string) => {
    setType(name as string)
  }

  const toast = (msg: string, title = '提示') => {
    msg && window.alert(`${title}\n${msg}`)
  }

  const stringifyResult = (res: string) => {
    if (typeof res === 'string') {
      return res
    } else {
      return JSON.stringify(res, null, 2)
    }
  }

  const resultStr = stringifyResult(result)

  hooks.useMount(() => { loadAppkeyList(true); });

  return (
    <div className='encrypt'>
      <Cell.Group card className="encrypt-section1">
        <Tabs active={type} onChange={handleUpdateActive}>
          <Tabs.TabPane title='加密' name='a'></Tabs.TabPane>
          <Tabs.TabPane title='解密' name='b'></Tabs.TabPane>
        </Tabs>
      </Cell.Group>
      <div className='encrypt-setion2'>
        <Cell.Group card className="input-box">
          <Cell title="秘钥" label="请选择秘钥" isLink size="large" onClick={() => setShowAppkeyPicker(true)}>
            <Field
              value={appkey}
              readonly
            ></Field>
          </Cell>
          <Cell title="秘钥" label="请填写秘钥" size="large">
            <Field
            type="textarea"
              value={appkey}
              clearable
              required
              placeholder="请填写秘钥"
              onChange={setAppkey}
            ></Field>
          </Cell>
          <Cell title="数据" label="请填写数据" size="large">
            <Field
              type="textarea"
              autosize={{ minHeight: 80, maxHeight: 300 }}
              required
              clearable
              value={data}
              placeholder="请填写数据"
              onChange={setData}
            ></Field>
          </Cell>
          <Cell>
            <Button type="primary" size="small" block round onClick={handleButtonClick}>开始</Button>
          </Cell>
          <Cell title="结果" label={ type === 'a' ? '加密结果' : '解密结果' }>
            <Field
              type="textarea"
              autosize={{ minHeight: 80, maxHeight: 300 }}
              value={resultStr}
            ></Field>
          </Cell>
        </Cell.Group>
      </div>
      <Popup round visible={showAppkeyPicker} position="top" onClose={() => setShowAppkeyPicker(false)}>
        <Picker
          title="选择秘钥"
          columns={appkeyList}
          onConfirm={(value: any) => {
            setAppkey(value);
            setShowAppkeyPicker(false);
          }}
          onCancel={() => setShowAppkeyPicker(false)}
        ></Picker>
      </Popup>
    </div>
  )
}

export default Encrypt;
