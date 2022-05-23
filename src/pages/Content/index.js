import {
  open as openPopup,
  close as closePopup,
  setIframeSize,
} from './modules/popup';

const MESSAGE_LISTEN_TYPE = '36cfdd19__xtjk_decrypt_message';
const CLOSE_ICON =
  '<svg t="1653313483423" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1356" width="16" height="16"><path d="M651.956565 599.850837l-88.714508-88.74316 88.840374-88.87005c14.007015-14.012132 13.976316-36.733623 0-50.746778-14.007015-14.012132-36.658921-14.043854-50.729381 0l-88.839351 88.87005-88.682785-88.74316c-14.007015-14.013155-36.785811-13.980409-50.761104 0-14.008039 14.012132-14.038738 36.733623 0 50.777477l88.713484 88.74316-88.840374 88.87005c-13.976316 13.980409-14.038738 36.766368-0.030699 50.777477 13.975293 13.980409 36.721343 14.013155 50.761104-0.030699l88.776929-88.807628 88.714508 88.744183c13.944594 13.948687 36.721343 14.043854 50.792826-0.031722C665.931858 636.617206 665.963581 613.894691 651.956565 599.850837L651.956565 599.850837 651.956565 599.850837M829.351811 193.688327c-174.71316-174.773536-459.121676-174.835957-633.899304 0-174.777629 174.835957-174.715207 459.33964 0 634.113175 174.777629 174.835957 459.121676 174.899402 633.931027 0.030699C1004.161163 652.995221 1004.161163 368.556007 829.351811 193.688327L829.351811 193.688327 829.351811 193.688327M235.108692 788.162714c-152.946414-152.99758-152.914692-401.840064-0.031722-554.805922 152.978137-153.028279 401.704988-152.99758 554.651402-0.030699 152.946414 152.996556 152.977114 401.838018 0 554.868343C636.876102 941.160293 388.023384 941.160293 235.108692 788.162714L235.108692 788.162714 235.108692 788.162714M235.108692 788.162714 235.108692 788.162714z" p-id="1357"></path></svg>';

/**
 * 向页面添加打开插件页面的按钮
 * @param {Object} data
 * @param {Boolean} data.withClose
 * @returns iframe
 */
function addButton({ withClose = true } = {}) {
  let opened = false;
  let iframe = null;
  let messageHandler = (size) => {
    setIframeSize(iframe, size);
  };
  return function _addButton() {
    /**
     * 添加样式
     * @param {Element} el 元素
     * @param {Object} styles 样式对象
     */
    function style(el, styles) {
      console.log(this);
      Object.keys(styles).forEach(function cb(key) {
        el.style[key] = styles[key];
      });
    }

    // 容器
    let containerEl = document.createElement('div');
    let containerStyle = {
      position: 'fixed',
      right: '10px',
      top: '100px',
      padding: '12px',
      background: '#fff',
      color: '#333',
      zIndex: 9999,
      boxShadow: '0px 0px 10px rgb(0 0 0 / 10%)',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0',
    };
    style(containerEl, containerStyle);

    // 主按钮
    let buttonEl = document.createElement('button');
    let buttonStyle = {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      lineHeight: 1,
      padding: 0,
    };
    buttonEl.innerHTML = 'xtjk-decrypt';
    style(buttonEl, buttonStyle);

    const open = (autoClose = true) => {
      if (autoClose && opened) {
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
    buttonEl.onclick = open;
    buttonEl.ondblclick = () => {
      open(false);
      setIframeSize(iframe, 'full'); // 全屏
    };

    // 关闭按钮
    let closeEl = document.createElement('span');
    closeEl.innerHTML = CLOSE_ICON;
    let closeStyle = {
      width: '16px',
      height: '16px',
      color: '#2c2c2c63',
      position: 'fixed',
      top: '90px',
      right: '4px',
    };
    closeEl.src = CLOSE_ICON;

    style(closeEl, closeStyle);

    const close = () => {
      document.body.removeChild(containerEl);
      opened = false;
      removeMessageListen({ handler: messageHandler });
      closePopup();
    };
    closeEl.onclick = close;

    containerEl.appendChild(buttonEl);
    containerEl.appendChild(closeEl);
    document.body.appendChild(containerEl);
    return containerEl;
  };
}

/**
 * 添加处理 iframe 消息监听
 * @param {Object} param0
 * @param {String} param0.type 消息类型
 * @param {Function} param0.handler 监听器
 */
function addMessageListen({ type, handler } = {}) {
  window.addEventListener('message', (e) => {
    const {
      data: { type: _type, body },
    } = e;
    if (type === _type && handler) {
      console.log(e);
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
  if (message.data && message.data.type === MESSAGE_LISTEN_TYPE) {
    console.log(message, sender, message.data);
  }
});
