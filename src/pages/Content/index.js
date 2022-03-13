import {
  open as openPopup,
  close as closePopup,
  setIframeSize,
} from './modules/popup';

const MESSAGE_LISTEN_TYPE = '36cfdd19__xtjk_decrypt_message_size';

/**
 * 向页面添加打开插件页面的按钮
 * @returns iframe
 */
function addButton() {
  let opened = false;
  let iframe = null;
  let messageHandler = (size) => {
    setIframeSize(iframe, size);
  };
  return function _addButton() {
    let el = document.createElement('button');
    el.innerHTML = 'xtjk-decrypt';
    el.style.position = 'fixed';
    el.style.right = '10px';
    el.style.top = '100px';
    el.style.padding = '0.6em';
    el.style.border = 'none';
    el.style.zIndex = 9999;
    el.style.background = '#fff';
    el.style.color = '#333';
    el.style.boxShadow = '0px 0px 10px rgb(0 0 0 / 10%)';
    el.style.borderRadius = '6px';
    el.style.cursor = 'pointer';
    el.onclick = () => {
      if (opened) {
        opened = false;
        removeMessageListen({ handler: messageHandler });
        closePopup();
      } else {
        opened = true;
        addMessageListen({
          type: MESSAGE_LISTEN_TYPE,
          handler: messageHandler,
        });
        iframe = openPopup();
      }
    };
    document.body.appendChild(el);
    return el;
  };
}

/**
 * 添加处理 iframe 消息监听
 * @param {Object} param0
 * @param {String} param0.type 消息类型
 * @param {Function} param0.handler 监听器
 */
function addMessageListen({ type, handler } = {}) {
  debugger;
  window.addEventListener('message', (e) => {
    console.log(e);
    const {
      data: { type: _type, body },
    } = e;
    if (type === _type && handler) {
      handler(body);
    }
  });
}

/**
 * 移除处理 iframe 消息监听
 * @param {Object} param0
 * @param {String} param0.type 消息类型
 * @param {Function} param0.handler 监听器
 */
function removeMessageListen({ handler } = {}) {
  if (handler) {
    window.removeEventListener('message', handler);
  }
}

addButton()();

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log(message, sender, message.data);
});
