import React, { useState } from 'react';
import { createSign, verifySign, isEncryptedData, BaseObject } from 'decrypt-core';
import { Toast, hooks, Field, Cell, Popup, Picker, Button, Tabs } from 'react-vant';
import {
  getAppKey,
  saveAppKey,
  convertHistory,
  EncryptHistoryItem,
  DecryptHistoryItem
} from './common/storage';
import { genDebug, genId, getNow } from './common/utils';

import './Sign.scss';

const debug = genDebug('sign-page')

const Sign = () => {
  const [result, setResult] = useState("");
  const [appkey, setAppkey] = useState("");
  const [data, setData] = useState("");
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

  const handleStartClick = () => {
    if (!appkey) {
      Toast('请填写秘钥')
      return
    }
    if (!data) {
      Toast('请填写数据')
      return
    }
    try {
      let d = JSON.parse(data)
      if (Object.prototype.toString.call(d) !== '[object Object]') {
        return Toast('数据不是 JSON 对象格式，例如: "{\"foo\": \"bar\"}"')
      }
    } catch (e) {
      return Toast('数据不是 JSON 格式')
    }
    let dataObject = JSON.parse(data) as BaseObject
    saveAppKey(appkey)
    try {
      let sign: string | boolean = false
      let encryptItem: EncryptHistoryItem
      let decryptItem: DecryptHistoryItem
      switch(type) {
        case 'a':
          sign = createSign(dataObject, appkey)

          // encryptItem = {
          //   id: genId(),
          //   date: getNow(),
          //   from: data,
          //   key: appkey,
          //   to: sign
          // }
          // convertHistory.addEncrypt(encryptItem)
          debug(sign, 'sign result')
          break
        case 'b':
          sign = verifySign(dataObject, appkey)

          // decryptItem = {
          //   id: genId(),
          //   date: getNow(),
          //   from: data,
          //   key: appkey,
          //   to: _data
          // }
          // convertHistory.addDecrypt(decryptItem)
          debug(sign, 'verifySign result')
          break
        default:
          break
      }
      // 测试用
      // if (Math.random() < 0.3) {
      //   throw new Error('加解密失败')
      // }
      setResult(typeof sign === 'boolean' ? sign + '' : sign)
      loadAppkeyList(false)
    } catch (e) {
      setResult("")
      toast((e as any).message, '加签验签报错')
      console.error(e)
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
    <div className='sign'>
      <Cell.Group card className="sign-section1">
        <Tabs active={type} onChange={handleUpdateActive}>
          <Tabs.TabPane title='加签' name='a'></Tabs.TabPane>
          <Tabs.TabPane title='验签' name='b'></Tabs.TabPane>
        </Tabs>
      </Cell.Group>
      <div className='sign-setion2'>
        {/* 小屏展示 */}
        <div className="input-box input-box--middle">
          <Cell.Group card>
            {/* 输入框 */}
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
                placeholder="请填写数据（必须为 JSON 对象格式）"
                onChange={setData}
              ></Field>
            </Cell>
            {/* 开始按钮 */}
            <Cell className="cell-button">
              <Button type="primary" size="small" block round onClick={handleStartClick}>开始</Button>
            </Cell>
            {/* 结果 */}
            <Cell title="结果" label={ type === 'a' ? '加签结果' : '验签结果' }>
              <Field
                type="textarea"
                autosize={{ minHeight: 80, maxHeight: 300 }}
                value={resultStr}
              ></Field>
            </Cell>
          </Cell.Group>
        </div>
        {/* 宽屏展示 */}
        <div className="input-box input-box--wide">
          <Cell.Group card className="left">
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
                placeholder="请填写数据（必须为 JSON 对象格式）"
                onChange={setData}
              ></Field>
            </Cell>
            {/* 开始按钮 */}
            <Cell className="cell-button">
              <Button type="primary" size="small" block round onClick={handleStartClick}>开始</Button>
            </Cell>
          </Cell.Group>
          <Cell.Group card className="right">
            {/* 结果 */}
            <Cell title="结果" label={ type === 'a' ? '加签结果' : '验签结果' }>
              <Field
                type="textarea"
                autosize={{ minHeight: 350, maxHeight: 560 }}
                value={resultStr}
              ></Field>
            </Cell>
          </Cell.Group>
        </div>
      </div>
      <Popup round visible={showAppkeyPicker} position="top" onClose={() => setShowAppkeyPicker(false)}>
        <Picker
          title="选择秘钥"
          columns={appkeyList}
          onChange={(value: any) => {
            setAppkey(value);
          }}
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

export default Sign;
