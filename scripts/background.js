chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveImageAs",
    title: "Save Image As What?",
    contexts: ["image"]
  });
  chrome.contextMenus.create({ id: "saveAsPNG", parentId: "saveImageAs", title: "PNG", contexts: ["image"] });
  chrome.contextMenus.create({ id: "saveAsJPG", parentId: "saveImageAs", title: "JPG", contexts: ["image"] });
  chrome.contextMenus.create({ id: "saveAsWebP", parentId: "saveImageAs", title: "WebP", contexts: ["image"] });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId.startsWith("saveAs")) {
    const format = info.menuItemId.replace("saveAs", "").toLowerCase();
    let srcUrl = info.srcUrl;

    if(info.srcUrl.startsWith("http")) {
      srcUrl = "https://api.allorigins.win/raw?url=" + info.srcUrl;
    }
    
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => typeof window.downloadImage === 'function'
    }, (results) => {
      if (results && results[0].result) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (url, format) => { window.downloadImage(url, format); },
          args: [srcUrl, format]
        });
      } else {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scripts/convert.js"]
        }).then(() => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (url, format) => { window.downloadImage(url, format); },
            args: [srcUrl, format]
          });
        });
      }
    });
  }
});