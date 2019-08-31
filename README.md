# jedemov2
## JSON-Editor Playground

The **JSON-Editor Interactive Playground** is a playground page where you can test various setups for the OpenSource JSON Schema parser [JSON-Editor](https://github.com/json-editor/json-editor#json-editor)

Here you can try various predefined examples or create your own schema and JavaScript test setups.

[![Screenshot](https://i.imgur.com/cil00cv.png)](https://pmk65.github.io/jedemov2/dist/demo.html)

Live version is available here: [https://pmk65.github.io/jedemov2/dist/demo.html](https://pmk65.github.io/jedemov2/dist/demo.html)

<br>

<small>If you got a good Schema and/or JavaScript examples that show off some of the more advanced features of JSON-Editor, please post it on the JSON-Editor Interactive Playground [GitHub page](https://github.com/pmk65/jedemov2/issues). I will then evaluate it and add it to the list of available examples. 🚀</small>

<br>

## About

The JSON-Editor Interactive Playground is a page where you can test various setups for the OpenSource JSON Schema parser [JSON-Editor](https://github.com/json-editor/json-editor)

Here you can try various predefined examples or create your own schema and JavaScript test setups.

<small>Supported Browsers: Chrome, Firefox & Microsoft Edge</small>

## Navigation
<br>

### The Tabs

* **Form** - The form generated from the schema. The form is created in an IFrame, isolated from the rest of the page.
* **Output** - The output and validation results from the form. (Only available if the editor is instantiated using the variable jseditor) Changing the output values will update the field values in the form.
* **Schema** - The JSON schema and starting values.
* **JavaScript/CSS** - Optional custom JavaScript and CSS setup.
* **Help** - The text you are reading right now. Description of loaded example will also be available here.

### The Buttons

* **Options** - JSON-Editor config options. (Form will be re-generated after exiting the config panel.)
* **Generate Form** - Generates the output form from the schema. The schema, startval, JavaScript & CSS will also be stored in browser LocalStorage for when you visit the page next time.
* **Direct Link** - Create direct link URL. (Note: Direct links overides any data previously saved in browser LocalStorage)
* **Reset Form** - Resets the playground and clear query parameters and browser LocalStorage.
* **Download** - Download the current Schema, Start Values, JavaScript and JSON-Editor settings locally in Playground JSON format.<br>*Note: If you made a good example that describes functionality not covered in the existing examples, please upload it to the Github page.*
* **Upload** - Upload a local JSON file in example format, into the Playground. You can also Drag'n'Drop the file directly onto the Playground. (Not available on Form Tab)
* 🅘 - Display List of external JavaScript and CSS files used in current example.
* **Load Example** - Opens panel with list of predefined examples to load.

### Custom JavaScript

In the JavaScript editor, the instance of the form is available in the variable ``jseditor`` and the schema and startval (if present) are available in the variable ``jedata``.
Also the global instance of the JSON-Editor is available in the variable ``JSONEditor``.

You can add custom JavaScript code above and below the mandatory (readonly) lines.

#### Special Comments

Two special comment functions are available in the JavaScript editor for creating more complex setups.

* **includeJS()** - Includes a custom JavaScript file.
* **includeCSS()** - Includes a custom JavaScript file.

For these to be recognized, they MUST be place inside a // comment tag.
Examples
````javascript
// includeJS("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js")
// includeCSS("https://pmk65.github.io/jedemov2/dist/examples/bloodhound.css")
````

*See the "Typeahead Autocomplete" and "Typeahead Autoprefill" examples for an example of usage.*
