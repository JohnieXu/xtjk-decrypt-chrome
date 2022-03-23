const IFRAME_ID = '__xtjk_decrypt_iframe';
const SIZE_TYPE = {
  mini: 'mini',
  wide: 'wide',
  full: 'full',
};
const IFRAME_STYLE = {
  mini: {
    position: 'fixed',
    right: '10px',
    top: '140px',
    width: '400px',
    height: '600px',
    borderRadius: '6px',
  },
  wide: {
    position: 'fixed',
    right: '10px',
    top: '140px',
    width: '800px',
    height: '600px',
    borderRadius: '6px',
  },
  full: {
    position: 'fixed',
    right: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    borderRadius: '0px',
  },
};

/**
 * 判断 iframe 是否已创建
 * @returns [isExits, iframeElement]
 */
const iframeExist = () => {
  const el = document.getElementById(IFRAME_ID);
  return [!!el, el];
};

/**
 * 打开 iframe 窗口，若不存在则创建，否则显示已存在的 iframe
 * @param {String} url url
 * @returns HTMLElement
 */
export const open = (url = chrome.runtime.getURL('popup.html')) => {
  let [exist, el] = iframeExist();
  if (exist) {
    toggle(false);
  } else {
    el = document.createElement('iframe');
    el.id = IFRAME_ID;
    el.style.position = 'fixed';
    el.style.right = '10px';
    el.style.top = '140px';
    el.style.width = '400px';
    el.style.height = '600px';
    el.style.border = 'none';
    el.style.zIndex = 1000000000001;
    el.style.background = '#fff';
    el.style.boxShadow = '0px 0px 10px rgb(0 0 0 / 10%)';
    el.style.borderRadius = '6px';
    el.style.transition = 'all 0.2s ease';
    el.src = url;
    document.body.appendChild(el);
  }
  return el;
};

/**
 * 关闭 iframe 窗口
 */
export const close = () => {
  const [exist, el] = iframeExist();
  if (exist) {
    document.body.removeChild(el);
  }
};

/**
 * 切换 iframe 窗口显隐
 * @param {Boolean} isHide 是否隐藏
 */
export const toggle = (isHide) => {
  const [exist, el] = iframeExist();
  const display = isHide ? 'none' : 'block';
  if (exist) {
    el.style.display = display;
  }
};

/**
 * 设置 iframe 窗口尺寸
 * @param {HTMLElement} iframe iframe
 * @param {String} size 窗口尺寸
 */
export const setIframeSize = (iframe, size) => {
  const style = IFRAME_STYLE[size];
  if (iframe && size && style) {
    for (const key in style) {
      if (Object.hasOwnProperty.call(style, key)) {
        const value = style[key];
        iframe.style[key] = value;
      }
    }
  }
};
