const CONST_APPKEY_KEY = 'appkey'

export type KeyItem = string;

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
