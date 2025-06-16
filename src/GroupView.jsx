/* eslint-disable react-refresh/only-export-components */
/* global chrome */

import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const GroupView = () => {
  const [group, setGroup] = useState(null);
  // const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log('params:', params); // dl
    const id = params.get('groupId');
    console.log('id:', id); // dl

    chrome.storage.local.get('tabGroups', (result) => {
      const groups = result.tabGroups || [];
      const selectedGroup = groups.find((group) => group.id === id);
      if (selectedGroup) {
        setGroup(selectedGroup);
        // setGroupId(id);
      } else {
        console.error('Group not found');
      }
    });
    setLoading(false);
  }, []);

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

  const handleUpdateTab = (i, inputField, newValue) => {
    const groupCopy = { ...group };
    groupCopy.tabs[i][inputField] = newValue;
    updateGroup(groupCopy);
  };

  const handleDeleteTab = (index) => {
    const groupAfterDeleteTab = {
      ...group,
      tabs: group.tabs.filter((_, i) => i !== index),
    };
    updateGroup(groupAfterDeleteTab);
  };

  const handleAddTab = () => {
    const url = prompt('Enter tab url');
    if (url) {
      const groupWithAddedUrl = {
        ...group,
        tabs: [...group.tabs, { url, title: url }],
      };
      updateGroup(groupWithAddedUrl);
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
              onChange={(e) => handleUpdateTab(i, 'title', e.target.value)}
            />
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
