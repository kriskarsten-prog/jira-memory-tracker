const Storage = {
  async getAll() {
    // Chrome / Chromium extension storage
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      return new Promise(resolve => {
        chrome.storage.local.get(null, resolve);
      });
    }

    // Island / fallback
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        items[key] = JSON.parse(localStorage.getItem(key));
      } catch {}
    }
    return items;
  },

  async set(key, value) {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.set({ [key]: value });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};
