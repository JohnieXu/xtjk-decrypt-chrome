import { printLine } from './modules/print';
import { open as openPopup, close as closePopup } from './modules/popup';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

function addButton() {
  let opened = false;
  return function _addButton() {
    let el = document.createElement('button');
    el.innerHTML = '打开xtjk-decrypt';
    el.style.position = 'fixed';
    el.style.right = '10px';
    el.style.top = '100px';
    el.style.padding = '0.6em';
    el.style.border = 'none';
    el.style.zIndex = 9999;
    el.style.background = '#fff';
    el.style.boxShadow = '0px 0px 10px rgb(0 0 0 / 10%)';
    el.style.borderRadius = '6px';
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
