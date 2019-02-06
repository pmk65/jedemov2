// Save current Schema and Startval
var schema = jsoneditor.schema;
var startval = jsoneditor.getValue();

// Enable Selectize
JSONEditor.plugins.selectize.enable = true;

// Regenerate the form
if (jsoneditor) jsoneditor.destroy();
jsoneditor = new window.JSONEditor(document.querySelector("#json-editor-form"),{schema: schema, startval: startval});
