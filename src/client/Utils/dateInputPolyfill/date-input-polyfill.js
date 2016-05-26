/**
 * @file
 * Code in this directory is copied from
 * https://github.com/jcgertig/date-input-polyfill and modified to display
 * danish days and months.
 */
import './date-input-polyfill.scss';
import Input from './input.js';

// Run the above code on any <input type="date"> in the document, also on dynamically created ones.
// Check if type="date" is supported.
if (!Input.supportsDateInput()) {
  Input.addPickerToDateInputs();

  document.addEventListener('DOMContentLoaded', ()=> {
    Input.addPickerToDateInputs();
  });
  // This is also on mousedown event so it will capture new inputs that might
  // be added to the DOM dynamically.
  document.querySelector('body').addEventListener('mousedown', ()=> {
    Input.addPickerToDateInputs();
  });
}
