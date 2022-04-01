import { DataType } from 'decrypt-core'

const CONST_APPKEY_KEY = 'appkey'
const CONST_HISTORY_KEY = 'history'
const CONST_HISTORY_MAX_LENGTH = 10 * 10000 // 最大历史记录数

export type KeyItem = string;
export interface HistoryItem {
  id: string
  date: Date
  type: EncryptType
  from: DataType
  key: string
  to: DataType
}

export type EncryptHistoryItem = Pick<HistoryItem, "id" | "date" | "from" | "key" | "to">
export type DecryptHistoryItem = Pick<HistoryItem, "id" | "date" | "from" | "key" | "to">

export enum EncryptType {
  Encrypt = '1',
  Decrypt = '2'
}

/**
 * 存储秘钥
 * @param appkey 秘钥
 * @returns 存储是否成功
 */
export function saveAppKey(appkey: KeyItem): Promise<boolean> {
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
          resolve(true)
        })
      })
    } else {
      resolve(true)
    }
  })
}

/**
 * 移除秘钥
 * @param appkey 秘钥
 * @returns 移除是否成功
 */
export function removeAppKey(appkey: KeyItem): Promise<boolean> {
  const APPKEY_KEY = CONST_APPKEY_KEY
  return new Promise((resolve, reject) => {
    if (appkey) {
      chrome.storage.sync.get({
        [APPKEY_KEY]: []
      }, (result) => {
        console.log(result)
        let keys = result[APPKEY_KEY]
        if (!keys.includes(appkey)) {
          resolve(true)
        } else {
          keys = keys.filter((i: string) => i !== appkey)
        }
        console.log('[debug] keys', keys)
        chrome.storage.sync.set({
          [APPKEY_KEY]: keys
        }, () => {
          resolve(true)
        })
      })
    } else {
      resolve(true)
    }
  })
}

/**
 * 查询秘钥列表
 * @returns 秘钥列表
 */
export function getAppKey(): Promise<KeyItem[]> {
  const APPKEY_KEY = CONST_APPKEY_KEY
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({
      [APPKEY_KEY]: []
    }, (result) => {
      let keys = result[APPKEY_KEY]
      console.log('[debug] getAppKey keys', keys)
      resolve(keys as KeyItem[])
    })
  })
}

export class ConvertHistory {
  maxLength: number;
  historyKey: string;
  constructor({ maxLength = CONST_HISTORY_MAX_LENGTH, historyKey = CONST_HISTORY_KEY } = {}) {
    if (maxLength <= 0) {
      maxLength = CONST_HISTORY_MAX_LENGTH
    }
    this.maxLength = maxLength
    this.historyKey = historyKey
  }
  /**
   * 查询所有历史记录（id 倒序）
   * @returns 历史记录列表
   */
  getAll(): Promise<HistoryItem[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({
        [this.historyKey]: []
      }, (result) => {
        let list = result[this.historyKey] as HistoryItem[]
        list = list.sort((a, b) => Number(b.id) - Number(a.id))
        console.log('[debug] covertHistory.geAll list', list)
        resolve(list)
      })
    })
  }
  /**
   * 清空历史记录
   * @returns 是否成功
   */
  clearAll(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({
        [this.historyKey]: []
      }, () => {
        resolve(true)
      })
    })
  }
  /**
   * 查询历史记录总数
   * @returns 历史记录总数
   */
  getLength(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getAll().then((list) => {
        resolve(list.length)
      })
    })
  }
  /**
   * 添加记录
   * @param data 记录项
   * @returns 是否成功
   */
  add(data: HistoryItem): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getAll().then((list) => {
        list.push(data)
        chrome.storage.sync.set({
          [this.historyKey]: list
        }, () => {
          resolve(true)
        })
      })
    })
  }
  addEncrypt(data: EncryptHistoryItem): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const _data = {
        ...data,
        type: EncryptType.Encrypt
      }
      this.add(_data).then(() => {
        resolve(true)
      })
    })
  }
  addDecrypt(data: DecryptHistoryItem): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const _data = {
        ...data,
        type: EncryptType.Decrypt
      }
      this.add(_data).then(() => {
        resolve(true)
      })
    })
  }
}

export const convertHistory = new ConvertHistory()
