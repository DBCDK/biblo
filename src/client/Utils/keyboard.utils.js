export function hideKeyboard(element) {
  element.setAttribute('readonly', 'readonly');
  element.setAttribute('disabled', 'true');

  setTimeout(function () {
    element.blur();
    document.body.focus();
    element.removeAttribute('readonly');
    element.removeAttribute('disabled');
  }, 100);
}
