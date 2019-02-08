jseditor.on('ready', function() {

  // Save the default Enum values
  var orgEnum = jseditor.schema.properties.test.enum;

  // Create button
  var d = document, b = d.createElement('button'), form = d.querySelector('#json-editor-form');
  b.appendChild(d.createTextNode('Toggle Enum Values'));
  form.parentNode.insertBefore(b, form.nextSibling);
  b.addEventListener('click', function() {

    this.dataset.toggle = this.dataset.toggle == '1' ? '0' : '1';

    // Get current Schema and Startval
    var schema = jseditor.schema;
    var startval = jseditor.getValue();

    // Modify the schema enum values
    schema.properties.test.enum = (this.dataset.toggle == '1') ? ['red','green','blue'] : orgEnum;

    // Regenerate the form
    if (jseditor) jseditor.destroy();
    jseditor = new window.JSONEditor(form ,{schema: schema, startval: startval});

  });

});
