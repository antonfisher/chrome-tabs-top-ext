const UPDATE_CPU = 'UPDATE_CPU';

chrome.processes.onUpdated.addListener((processes) => {
  for (let id in processes) {
    if (!processes.hasOwnProperty(id)) {
      continue;
    }
    const {tasks, cpu} = processes[id];
    let tab;
    for (let i = 0; i < tasks.length; i++) {
      const {tabId, title} = tasks[i];
      if (typeof tasks[i].tabId !== 'undefined') {
        tab = {tabId, title, cpu};
        break;
      }
    }

    if (tab) {
      chrome.tabs.get(tab.tabId, (chromeTab) => {
        if (
          !chrome.runtime.lastError
          && chromeTab
          && chromeTab.url
          && chromeTab.url.startsWith('http')
        ) {
          chrome.tabs.sendMessage(tab.tabId, {type: UPDATE_CPU, value: tab.cpu.toFixed(0)})
        }
      });
    }
  }
});
