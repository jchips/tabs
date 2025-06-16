/* global chrome */

import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css';

function App() {
  const [status, setStatus] = useState('');
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    chrome.storage.local.get('tabGroups', (result) => {
      setGroups(result.tabGroups || []);
    });
  }, []);

  // const saveCurrentTabs = async () => {
  //   const tabs = await chrome.tabs.query({ currentWindow: true });
  //   const urls = tabs.map((tab) => tab.url); // creates array of tab urls
  //   chrome.tabs.group({urls}, (groupId) => {
  //     chrome.tabGroups.update(groupId, {
  //       name: 'New group'
  //     })
  //   })
  //   // chrome.storage.local.set({ savedTabs: urls }, () => {
  //   //   setStatus('Current tabs saved');
  //   // });
  // };

  const saveGroup = async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const newGroup = {
      id: uuid(),
      name,
      tabs: tabs.map((tab) => ({
        // create object for each tab in group
        url: tab.url,
        title: tab.title,
      })),
    };
    const updatedGroups = [...groups, newGroup];
    chrome.storage.local.set({ tabGroups: updatedGroups }, () => {
      setGroups(updatedGroups);
      setName('');
      setStatus('Group saved');
    });
  };

  const deleteGroup = (i) => {
    const groupsCopy = [...groups];
    groupsCopy.splice(i, 1);
    chrome.storage.local.set({ tabGroups: groupsCopy }, () => {
      setGroups(groupsCopy);
      setStatus('Deleted group');
    });
  };

  const openGroup = (group) => {
    if (group.tabs && group.tabs.length > 0) {
      group.tabs.forEach((tab) =>
        chrome.tabs.create({
          url: tab.url,
        })
      );
      setStatus('Opened tab group');
    }
  };

  return (
    <div>
      <h1>Tabs</h1>
      <input
        placeholder='Group Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={saveGroup}>Save group</button>

      <h3>Saved groups</h3>
      {groups.map((group) => (
        <div key={group.id}>
          <strong>{group.name}</strong>
          <button onClick={() => openGroup(group)}>Open</button>
          <button
            onClick={() =>
              chrome.tabs.create({
                url: `group.html?groupId=${group.id}`,
              })
            }
          >
            View
          </button>
          <button onClick={() => deleteGroup(group.id)}>Delete</button>
        </div>
      ))}

      <p>{status}</p>
    </div>
  );
}

export default App;
