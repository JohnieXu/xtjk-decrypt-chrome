import { printLine } from './modules/print';
import { open as openPopup } from './modules/popup';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");
openPopup();
