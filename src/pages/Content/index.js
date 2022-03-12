import { open as openPopup, close as closePopup } from './modules/popup';

function addButton() {
  let opened = false;
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
        closePopup();
      } else {
        opened = true;
        openPopup();
      }
    };
    document.body.appendChild(el);
  };
}

addButton()();

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log(message, sender, message.data);
});
