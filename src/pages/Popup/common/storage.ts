import { DataType } from 'decrypt-core'
import { genDebug } from './utils'

const CONST_APPKEY_KEY = 'appkey'
const CONST_HISTORY_KEY = 'history'
const CONST_FAVORITE_KEY = 'favorite'
const CONST_HISTORY_MAX_LENGTH = 10 * 10000 // 最大记录数

const debug = genDebug('storage')

export type KeyItem = string;
export interface HistoryItem {
  id: string
  date: string
  type: EncryptType
  from: DataType
  key: string
  to: DataType
}

export type HistoryIdOrItem = HistoryItem | string

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
        debug(result, 'saveAppKeyResult')
        let keys = result[APPKEY_KEY]
        if (!keys.includes(appkey)) {
          keys = [...keys, appkey]
        }
        debug(keys, 'keys')
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
        debug(result, 'removeAppKeyResult')
        let keys = result[APPKEY_KEY]
        if (!keys.includes(appkey)) {
          resolve(true)
        } else {
          keys = keys.filter((i: string) => i !== appkey)
        }
        debug(keys, 'keys')
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
      debug(keys, 'getAppKey keys')
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
        debug(list, 'covertHistory.getAll list')
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
  /**
   * 移除记录
   * @param data 待移除记录
   * @returns 是否成功
   */
  remove(data: HistoryIdOrItem): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getAll().then((list) => {
        const _list: HistoryItem[] = list.filter((item) => {
          if (typeof data === 'string') {
            return data !== item.id
          } else {
            return data.id !== item.id
          }
        });
        chrome.storage.sync.set({
          [this.historyKey]: _list
        }, () => {
          resolve(true);
        });
      })
    })
  }
  /**
   * 添加加密记录
   * @param data 待添加记录
   * @returns 是否成功
   */
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
  /**
   * 添加解密记录
   * @param data 待添加记录
   * @returns 是否成功
   */
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

/**
 * 加解密历史记录
 */
export const convertHistory = new ConvertHistory({
  historyKey: CONST_HISTORY_KEY,
  maxLength: CONST_HISTORY_MAX_LENGTH
})

/**
 * 收藏记录
 */
export const favoriteHistory = new ConvertHistory({
  historyKey: CONST_FAVORITE_KEY,
  maxLength: CONST_HISTORY_MAX_LENGTH
})
