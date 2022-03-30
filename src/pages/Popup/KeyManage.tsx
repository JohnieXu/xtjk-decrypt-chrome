import { Plus, Replay, DeleteO } from "@react-vant/icons";
import React, { useState, useEffect, useRef } from "react";
import { Button, Field, Form, Popup, Toast, hooks, Cell, List, FieldInstance, Loading, Flex, Dialog } from 'react-vant';
import { saveAppKey, getAppKey, removeAppKey, KeyItem } from "./common/storage";

import './KeyManage.scss';

type FormValue = {
  name: string
  value: string
}

const noop = () => {};

const KeyManage = () => {

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [listLoading, setListLoding] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [keyList, setKeyList] = useState<KeyItem[]>([]);

  const nameFieldRef = useRef<FieldInstance>(null);

  const handleAddClick = (e: React.MouseEvent) => {
    setPopupVisible(true);
    setTimeout(() => {
      nameFieldRef?.current?.focus();
    }, 300);
  }

  const handleRefreshClick = () => {
    loadKeyList();
  }

  const handleCancelClick = () => {
    setPopupVisible(false);
  }

  const handleRemoveClick = (keyItem: KeyItem) => {
    console.log(keyItem);
    Dialog.confirm({
      title: '提示',
      message: `将要删除秘钥：${keyItem}`,
      showCancelButton: true
    }).then(() => {
      removeAppKey(keyItem).then(() => {
        Toast('删除成功！');
        loadKeyList().catch(() => {
          Toast('刷新列表失败！');
        });
      }).catch((e) => {
        console.log(e);
        Toast('删除失败！');
      });
    }).catch(noop);
  }

  const handleFormSubmit = (data: FormValue) => {
    saveAppKey(data.value).then(() => {
      loadKeyList();
      setPopupVisible(false);
      Toast('保存成功！');
      data.name = '';
      data.value = '';
    }).catch((e) => {
      Toast('保存失败！\n' + e.message);
    });
  }

  const loadKeyList = (): Promise<boolean> => {
    setListLoding(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        getAppKey().then((keyList) => {
          setKeyList(keyList);
          setListLoding(false);
          resolve(true);
        }).catch((e) => {
          setListLoding(false);
          reject(e);
        });
      }, 600);
    });
  };

  const renderKeyItem = (keyItem: KeyItem, key: number | string) => {
    return (
      <Cell
        key={key}
        extra={
        <DeleteO
          onClick={
            () => { handleRemoveClick(keyItem); }
          }
          style={{ cursor: 'pointer' }}
          />
        }>{keyItem}</Cell>
    )
  }

  hooks.useMount(loadKeyList);
  
  return (
    <div className="keyManage">
      <div className="section-operation">
        <Button.Group onClick={noop} block round>
          <Button
            type="primary"
            size="small"
            onClick={handleAddClick}
            icon={<Plus/>}
          >添加</Button>
          <Button
            type="primary"
            size="small"
            onClick={handleRefreshClick}
            icon={<Replay />}
          >刷新</Button>
        </Button.Group>
      </div>
      {
        listLoading ? (
          <Flex justify="center" align="center" style={{ marginTop: '200px' }}>
            <Flex.Item flex="0 0 30px">
              <Loading type="spinner" />
            </Flex.Item>
          </Flex>
        ) : (
          <List className="section-list" finished={true} loading={listLoading}>
          {
            keyList.map((key, i) => renderKeyItem(key, i))
          }
          </List>
        )
      }
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
