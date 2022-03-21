import { Plus } from "@react-vant/icons";
import React, { useState, useEffect, useRef } from "react";
import { Button, Field, Form, Popup, Toast, hooks, Cell, List, FieldInstance } from 'react-vant';
import { saveAppKey, getAppKey, KeyItem } from "./common/storage";

import './KeyManage.scss'

type FormValue = {
  name: string
  value: string
}

const KeyManage = () => {

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [keyList, setKeyList] = useState<KeyItem[]>([]);

  const nameFieldRef = useRef<FieldInstance>(null);

  const handleAddClick = (e: React.MouseEvent) => {
    setPopupVisible(true);
    setTimeout(() => {
      nameFieldRef?.current?.focus();
    }, 300);
  }

  const handleCancelClick = () => {
    setPopupVisible(false);
  }

  const handleFormSubmit = (data: FormValue) => {
    saveAppKey(data.value).then(() => {
      loadKeyList();
      setPopupVisible(false);
      Toast('保存成功！');
    }).catch((e) => {
      Toast('保存失败！\n' + e.message);
    });
  }

  const loadKeyList = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      getAppKey().then((keyList) => {
        setKeyList(keyList);
        resolve(true);
      }).catch((e) => {
        reject(e);
      });
    });
  };

  const renderKeyItem = (keyItem: KeyItem, key: number | string) => {
    return (
      <Cell key={key}>{keyItem}</Cell>
    )
  }

  hooks.useMount(loadKeyList);
  
  return (
    <div className="keyManage">
      <Button
        type="primary"
        size="small"
        round
        onClick={handleAddClick}
        icon={<Plus/>}
      >添加</Button>
      <List finished={true}>
      {
        keyList.map((key, i) => renderKeyItem(key, i))
      }
      </List>
      <Popup
        visible={popupVisible}
        style={{
          width: '300px',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <Form
          form={form}
          showValidateMessage={false}
          footer={
            <div style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}>
              <Button
                type="default"
                size="small"
                onClick={handleCancelClick}
                round
              >取消</Button>
              <Button
                type="primary"
                nativeType="submit"
                size="small"
                style={{
                  marginLeft: '10px'
                }}
                round
              >立即保存</Button>
            </div>
          }
          onFinish={handleFormSubmit}
        >
          <Form.Item
            tooltip={{
              message: '为秘钥对应的名称可重复'
            }}
            rules={[
              { required: true, message: '请填写名称' }
            ]}
            name="name"
            label="名称"
          >
            <Field ref={nameFieldRef} placeholder="请填写名称"></Field>
          </Form.Item>
          <Form.Item
            tooltip={{
              message: '为秘钥内容可重复，若重复将重复保存，本地会生成唯一 ID 记录秘钥'
            }}
            rules={[
              { required: true, message: '请填写秘钥' }
            ]}
            name="value"
            label="秘钥"
          >
            <Field placeholder="请填写秘钥"></Field>
          </Form.Item>
        </Form>
      </Popup>
    </div>
  )
}

export default KeyManage;
