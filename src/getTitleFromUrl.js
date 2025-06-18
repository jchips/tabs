/* global chrome */

/**
 * Fetches the title of the tab from the given url.
 * While fetching the title, the tab will briefly open in the
 * browser background and then close.
 * @param {string} url - The url of the new tab that is being added.
 * @returns {promise} - A promise with the fetched title of the tab.
 */
const getTitleFromUrl = async (url) => {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: false }, (tab) => {
      // eslint-disable-next-line no-unused-vars
      const listener = (tabId, changeInfo, updatedTab) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.get(tabId, (loadedTab) => {
            chrome.tabs.remove(tabId) // closes tab
            chrome.tabs.onUpdated.removeListener(listener)
            resolve(loadedTab.title)
          })
        }
      }
      chrome.tabs.onUpdated.addListener(listener)
    })
  })
}

export default getTitleFromUrl