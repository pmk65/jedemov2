var creditCardTypeChangedHandler = function(type) {
  var el = this.element.nextSibling;
  if (el && el.classList.contains('help-block')) {
    el.innerHTML = 'Card type: <strong>' + type + '</strong>';
  }
}
