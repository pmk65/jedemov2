// Save current Schema and Startval
var schema = jseditor.schema;
var startval = jseditor.getValue();

// Enable Selectize
JSONEditor.plugins.selectize.enable = true;

// Regenerate the form
if (jseditor) jseditor.destroy();
jseditor = new window.JSONEditor(document.querySelector("#json-editor-form"),{schema: schema, startval: startval});
