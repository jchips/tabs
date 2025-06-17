/* eslint-disable react-refresh/only-export-components */
/* global chrome */

import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import getTitleFromUrl from './getTitleFromUrl';

const GroupView = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Fetches groupId and finds the selected group */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('groupId');

    chrome.storage.local.get('tabGroups', (result) => {
      const groups = result.tabGroups || [];
      const selectedGroup = groups.find((group) => group.id === id);
      if (selectedGroup) {
        setGroup(selectedGroup);
      } else {
        console.error('Group not found');
      }
    });
    setLoading(false);
  }, []);

  /**
   * Updates the group in the Chrome storage and the component state.
   * @param {Object} updatedGroup - The group that has been modified.
   */
  const updateGroup = (updatedGroup) => {
    chrome.storage.local.get('tabGroups', (result) => {
      const groups = result.tabGroups || [];
      // groups[groupId] = updatedGroup;
      const updatedGroups = groups.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      );
      chrome.storage.local.set({ tabGroups: updatedGroups }, () => {
        setGroup(updatedGroup);
      });
    });
  };

  /**
   *
   * @param {number} i - The tab index
   * @param {string} inputField - "url"
   * @param {string} newValue - A new value for the tab url
   */
  const handleUpdateTab = (i, inputField, newValue) => {
    const groupCopy = { ...group };
    groupCopy.tabs[i][inputField] = newValue;
    updateGroup(groupCopy);
  };

  /**
   * Deletes given tab from tab group
   * @param {number} index - The tab index
   */
  const handleDeleteTab = (index) => {
    const groupAfterDeleteTab = {
      ...group,
      tabs: group.tabs.filter((_, i) => i !== index),
    };
    updateGroup(groupAfterDeleteTab);
  };

  /* Adds new tab to group */
  const handleAddTab = async () => {
    const url = prompt('Enter tab url');
    if (url) {
      try {
        const title = await getTitleFromUrl(url);
        const groupWithAddedUrl = {
          ...group,
          tabs: [...group.tabs, { url, title }],
        };
        updateGroup(groupWithAddedUrl);
      } catch (err) {
        console.error('failed to fetch tab title:', err);
      }
    }
  };

  if (loading || !group) return <p>Loading...</p>;

  return (
    !loading && (
      <div>
        <h2>{group.name}</h2>
        {group.tabs.map((tab, i) => (
          <div key={i}>
            <p>{tab.title}</p>
            <input
              value={tab.url}
              onChange={(e) => handleUpdateTab(i, 'url', e.target.value)}
            />
            <button onClick={() => handleDeleteTab(i)}>Delete</button>
          </div>
        ))}
        <button onClick={handleAddTab}>Add new tab</button>
      </div>
    )
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<GroupView />);
