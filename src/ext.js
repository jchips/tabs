/* global browser, chrome */

/* Exports the correct browser storage type depending on what browser the user is using. */
const ext = typeof browser !== 'undefined' ? browser : chrome;

export default ext;
