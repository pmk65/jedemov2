// Cleave onCreditCardTypeChanged handler
var creditCardTypeChangedHandler = function(type) {
  var el = this.element.nextSibling;
  if (el) el.innerHTML = 'Card type: <strong>' + type + '</strong>';
};

// Save current Schema and Startval
var schema = jsoneditor.schema;
var startval = jsoneditor.getValue();

// Patch schema options and add Cleave onCreditCardTypeChanged function
schema.properties.creditcard.options.cleave.onCreditCardTypeChanged = creditCardTypeChangedHandler;

// Regenerate the form
if (jsoneditor) jsoneditor.destroy();
jsoneditor = new window.JSONEditor(document.querySelector("#json-editor-form"),{schema: schema, startval: startval});
