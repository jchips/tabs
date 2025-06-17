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

  const editGroupName = () => {
    const groupName = prompt('Enter name for tab group');
    if (groupName) {
      const groupWithUpdatedName = {
        ...group,
        name: groupName,
      };
      updateGroup(groupWithUpdatedName);
    }
  };

  if (loading || !group) return <p>Loading...</p>;

  return (
    !loading && (
      <main className='h-screen w-screen overflow-y-auto text-center'>
        <header className='flex justify-center items-center space-x-3 m-5'>
          <h1 className='font-semibold text-center'>{group.name}</h1>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='size-4 cursor-pointer mt-1'
            onClick={editGroupName}
          >
            <path d='M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z' />
            <path d='M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z' />
          </svg>
        </header>
        <Button onClick={handleAddTab}>Add new tab</Button>
        <div className='w-full p-10 overflow-x-auto flex justify-center items-center'>
          <Table striped className='w-full table-fixed'>
            <TableHead>
              <TableHeadCell className='w-1/4'>Title</TableHeadCell>
              <TableHeadCell className='w-2/4'>URL</TableHeadCell>
              <TableHeadCell className='w-1/4'>Remove from group</TableHeadCell>
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
