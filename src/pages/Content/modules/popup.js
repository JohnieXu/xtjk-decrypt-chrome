const iframeId = '__xtjk_decrypt_iframe';

export const open = (url = chrome.runtime.getURL('popup.html')) => {
  const el = document.createElement('iframe');
  el.id = iframeId;
  el.style.position = 'fixed';
  el.style.right = '10px';
  el.style.top = '140px';
  el.style.width = '400px';
  el.style.height = '600px';
  el.style.border = 'none';
  el.style.zIndex = 9999;
  el.style.background = '#fff';
  el.style.boxShadow = '0px 0px 10px rgb(0 0 0 / 10%)';
  el.style.borderRadius = '6px';
  el.src = url;
  document.body.appendChild(el);
};

export const close = () => {
  const el = document.getElementById(iframeId);
  if (el) {
    document.body.removeChild(el);
  }
};
