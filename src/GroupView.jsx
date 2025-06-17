/* eslint-disable react-refresh/only-export-components */
/* global chrome */

import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';
import getTitleFromUrl from './getTitleFromUrl';
import Button from './components/buttons/Button';
import TableButton from './components/buttons/TableButton';
import './index.css';

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
      <main className='h-screen w-screen overflow-y-auto text-center'>
        <h1 className='m-5 font-semibold text-center'>{group.name}</h1>
        <Button onClick={handleAddTab}>Add new tab</Button>
        <div className='w-full p-10 overflow-x-auto flex justify-center items-center'>
          <Table striped className='w-full table-fixed'>
            <TableHead>
              <TableHeadCell className='w-1/4'>Title</TableHeadCell>
              <TableHeadCell className='w-2/4'>URL</TableHeadCell>
              <TableHeadCell className='w-1/4'>Delete from group</TableHeadCell>
            </TableHead>
            <TableBody>
              {group.tabs.map((tab, i) => (
                <TableRow
                  key={i}
                  className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800'
                >
                  <TableCell className='font-medium text-gray-900 dark:text-white'>
                    {tab.title}
                  </TableCell>
                  <TableCell className='text-gray-900 dark:text-white'>
                    <input
                      value={tab.url}
                      onChange={(e) =>
                        handleUpdateTab(i, 'url', e.target.value)
                      }
                      type='text'
                      id='default-input'
                      className='py-4 px-2.5 w-full m-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    />
                  </TableCell>
                  <TableCell>
                    <TableButton onClick={() => handleDeleteTab(i)}>
                      Delete
                    </TableButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    )
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<GroupView />);
