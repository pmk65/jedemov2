// Cleave onCreditCardTypeChanged handler
var creditCardTypeChangedHandler = function(type) {
  var el = this.element.nextSibling;
  if (el) el.innerHTML = 'Card type: <strong>' + type + '</strong>';
};

// Save current Schema and Startval
var schema = jseditor.schema;
var startval = jseditor.getValue();

// Patch schema options and add Cleave onCreditCardTypeChanged function
schema.properties.creditcard.options.cleave.onCreditCardTypeChanged = creditCardTypeChangedHandler;

// Regenerate the form
if (jseditor) jseditor.destroy();
jseditor = new window.JSONEditor(document.querySelector("#json-editor-form"),{schema: schema, startval: startval});
