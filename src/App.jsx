/* global chrome */

import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import SmallButton from './components/buttons/SmallButton';
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
      <h1 className='mb-5 font-semibold'>Tabs</h1>
      <div className='flex justify-center items-center space-x-2'>
        <input
          placeholder='Group Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          type='text'
          id='small-input'
          className='p-2 m-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        />
        <button
          onClick={saveGroup}
          type='button'
          className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-4 py-3 my-2 mx-1 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
        >
          Save group
        </button>
      </div>

      <h3 className='my-5 font-medium text-base text-center'>Saved groups</h3>
      {groups.map((group) => (
        <section>
          <div
            key={group.id}
            className='flex justify-center items-center space-x-4 mx-2 my-4'
          >
            <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
              {group.name}
            </span>
            <SmallButton
              onClick={() => openGroup(group)}
              className='bg-indigo-800 hover:bg-indigo-900 focus:ring-indigo-300 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:focus:ring-indigo dark:border-indigo-700'
            >
              Open
            </SmallButton>
            <SmallButton
              onClick={() =>
                chrome.tabs.create({
                  url: `group.html?groupId=${group.id}`,
                })
              }
            >
              View
            </SmallButton>
            <SmallButton onClick={() => deleteGroup(group.id)}>
              Delete
            </SmallButton>
          </div>
          {groups.length > 1 && (
            <hr class='h-px bg-gray-200 border-0 rounded-sm dark:bg-gray-700'></hr>
          )}
        </section>
      ))}

      <p className='font-sm mt-3 text-center text-gray-500 dark:text-gray-400'>
        {status}
      </p>
    </div>
  );
}

export default App;
