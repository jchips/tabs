import ext from './ext'

/**
 * Fetches the title of the tab from the given url.
 * While fetching the title, the tab will briefly open in the
 * browser background and then close.
 * Error catching required for Firefox.
 * @param {string} url - The url of the new tab that is being added.
 * @returns {promise} - A promise with the fetched title of the tab.
 */
const getTitleFromUrl = async (url) => {
  return new Promise((resolve, reject) => {
    ext.tabs.create({ url, active: false }, (tab) => {
      if (!tab?.id) {
        reject('Failed to create tab')
        return
      }
      // eslint-disable-next-line no-unused-vars
      const listener = (tabId, changeInfo, updatedTab) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          ext.tabs.get(tabId, (loadedTab) => {
            ext.tabs.remove(tabId) // closes tab
            ext.tabs.onUpdated.removeListener(listener)
            resolve(loadedTab.title)
          })
        }
      }
      ext.tabs.onUpdated.addListener(listener)
    })
  })
}

export default getTitleFromUrl