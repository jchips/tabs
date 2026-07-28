# Tabs

A simple tab manager extension for Chrome and Firefox browsers.

## Author: Jelani R

## Architecture

- Built with React + Vite, Tailwindcss + Flowbite
- Languages used: JavaScript

## Setup

Follow steps in this order:

1. Run `npm install`
2. Run `npm install flowbite-react@latest`
3. Run `npx flowbite-react@latest init`
4. Run `npm run build`
5. Unpack the /dist folder in [Chrome extensions](chrome://extensions/) or in [Firefox debugging](about:debugging#/runtime/this-firefox)

## Changelog

- **2025.01.05 (1.0.3)** - Added support for Firefox
- **2025.06.18 (1.0.2)** - Fixed delete group bug where wrong group is sometimes deleted, new group adds to top instead of bottom
- **2025.06.17 (1.0.1)** - Ability to edit tab group names
- **2025.06.16 (1.0.0)** - Ability to view and edit tab groups, added styling
- **2025.06.15 (0.0.1)** - Ability to add and remove tab groups

## Credits / Resources

- [developer.chrome.com](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_the_Tabs_API)
- [Manifest V3 guide](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/)
- [UUID](http://npmjs.com/package/uuid)
- [Tailwindcss v4](https://tailwindcss.com/)
- [Flowbite](https://flowbite.com/)
- [Tab icon from icons8.com](https://icons8.com/icons/set/tabs--os-windows)
- [Pen icon from Heroicons](https://heroicons.com/micro)
