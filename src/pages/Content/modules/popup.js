export const open = () => {
  const app = document.createElement('iframe');
  app.style.position = 'fixed';
  app.style.right = '10px';
  app.style.top = '10vh';
  app.style.width = '300px';
  app.style.height = '400px';
  app.style.border = 'none';
  app.style.background = '#fff';
  app.style.boxShadow = '0px 0px 10px rgb(0 0 0 / 10%)';
  app.style.borderRadius = '6px';
  // app.src = chrome.runtime.getURL('popup.html');
  app.src = 'https://yfzx.whty.com.cn/fakebank/';
  document.body.appendChild(app);
  console.log(app);
};
