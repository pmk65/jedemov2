/*jshint -W054 */
 (function() {

    var globalTest = "i am LOCAL"; // Dummy test var

    // Theme to use in ACE editor instances
    var aceTheme = 'ace/theme/github';

    // ACE Editor placeholders
    var jeEditSchema = document.querySelector('#schema');
    var jeEditStartval = document.querySelector('#startval');
    var jeEditCode = document.querySelector('#editor');

    // ACE Editor instances
    var aceCodeEditor;
    var aceSchemaEditor;
    var aceStartvalEditor;

    // Error Modal box
    var jeModal = document.querySelector(".modal");
    var jeModalContent = jeModal.querySelector("p");
    var jeModalClose = jeModal.querySelector(".close-button");

    // Options Select boxes
    var jeTheme = document.querySelector('#theme');
    var jeIconlib = document.querySelector('#iconlib');
    var jeLayout = document.querySelector('#object_layout');
    var jeErrors = document.querySelector('#show_errors');
    var jeTemplate = document.querySelector('#template');

    // Options Checkboxes (Wrapper, not single checkboxes)
    var jeBool = document.querySelector('#boolean_options');
    var jeExtlib = document.querySelector('#ext_lib');

    // Buttons
    var jeSchemaLoad = document.querySelector('#external-schema'); // Load schema
    var jeCodeRestore = document.querySelector('#restore-code'); // Restore initial value of ACE editor
    var jeSchemaRestore = document.querySelector('#restore-schema'); // Restore initial value of ACE editor
    var jeExec = document.querySelector('#execute-code'); // Create form from Schema
    var jeDirectLink = document.querySelector('#direct_link'); // Create direct link url

    /* Helper functions */

    // Tests if JSON schema is invalid. Returns errormsg if invalid
    var isInvalidJson = function(code) {
      try { JSON.parse(code); }
      catch(e) { return 'Invalid Schema: ' + e.message.charAt(12).toUpperCase() + e.message.slice(13); }
      return false;
    };

    // Convert URL GET parameters into object
    var getUrlParams = function() {
      var prmstr = window.location.search.substr(1), params = {};
      if (prmstr != null && prmstr !== "") {
        var prmarr = prmstr.split("&");
        for ( var i = 0; i < prmarr.length; i++) {
          var tmparr = prmarr[i].split("=");
          params[tmparr[0]] = tmparr[1];
        }
      }
      return params;
    };

    // Get options object from checkboxes and selectboxes
    // if "data-json-editor-special" is set on tag, it will not be included
    var getJsonEditorOptions = function() {
      var options = {},
          cfg = document.querySelector('#json-editor-confg'),
          exclude = ':not([data-json-editor-special])',
          els = cfg.querySelectorAll('input[type="checkbox"]' + exclude + ',select' + exclude);
      Array.from(els).forEach(function(el) {
        if (el.type == 'checkbox' && el.checked) options[el.value] = el.checked;
        else if (el.value !== '') options[el.id] = el.value;
      });
      return options;
    };

    // convert object into query string
    function toQueryString(obj) {
      var parts = [];
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
      }
      return parts.join("&");
    }

    // Create Direct Link URL
    var updateDirectLink = function() {
      var params = getUrlParams();
      console.log('URL params', params);
      var queryString = toQueryString(getJsonEditorOptions());
      console.log('Query string',queryString);
    };

    // Load external JSON file
    var loadJSON = function(file, callback) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', file, true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          callback(xobj.responseText);
        }
      };
      xobj.send(null);
    };

    // Build codeblock to create JSON-Editor instance
    var getCode = function(schema, startval) {
      return 'if (jsoneditor) jsoneditor.destroy();jsoneditor = new window.JSONEditor(document.querySelector("#json-editor-form"),{schema: ' + schema + ', startval: ' + startval + '});';
    };

    // Insert script tag into page
    var insertScriptTag = function(code, ident) {
      var scriptTag = document.querySelector('script#' + ident);

      // Remove existing script tag with id=<ident>
      if (scriptTag) {
        scriptTag.parentNode.removeChild(scriptTag);
      }

      // Create script tag with id=<ident> and add it to page
      scriptTag = document.createElement('script');
      scriptTag.id = ident;
      scriptTag.appendChild(document.createTextNode(code));
      document.body.appendChild(scriptTag);
    };

    // Click event handler - Toggle visibility state of modal box
    var toggleModal = function() {
      jeModal.classList.toggle("show-modal");
    };

    // Click event handler - Close modal box if clicked outside
    var closeModal = function(e) {
      if (e.target === jeModal) toggleModal();
    };

     // Show JSON error in modal box
     var showModalError = function() {
      var res = isInvalidJson(this.getValue());
      if (res) {
        jeModalContent.innerText = res;
        toggleModal();
      }
    };

    // Evaluate/execute code without inserting it on page
    var evaluateCode = function(code, strict) {
      if (strict) {
        //"use strict";
        code = '"use strict";' + code;
      }
      try {
        new Function(code)();
      }
      catch(e) {
        jeModalContent.innerText = e.message;
        toggleModal();
        return false;
      }
      return true;
    };

    // Change event handler - Load selected JSON Schema into editor
    var loadJSONFile = function() {
      var file = this.options[this.selectedIndex].value;
      if (file) {
        loadJSON(file, function(response) {
          aceSchemaEditor.setValue(response);
          aceSchemaEditor.session.getSelection().clearSelection();
        });
      }
    };

    // Change event handler - for Options selectboxes
    var getSelectValue = function(e) {
       console.log('String option "' + this.id + '" changed to "' + this.value + '"');
    };

    var getCheckboxValue = function(e) {
      if (e.target.type == 'checkbox') {
        console.log('Boolean option "' + e.target.value + '" changed to "' + e.target.checked.toString() + '"');
      }
    };

    // Click event handler - Set restore to default for ACE Editor
    var setRestoreButton = function(sel, ed) {
      sel.addEventListener('click', function(def, e) {
        e.preventDefault();
        this.setValue(def);
        this.session.getSelection().clearSelection();
      }.bind(ed, ed.getValue()));
    };

    // Click event handler - Creates the from from the Schema
    var generateForm = function(e) {
      e.preventDefault();

      // Get content of ACE editor schema and JavaScript;
      var code = getCode(aceSchemaEditor.getValue(), '{}') + aceCodeEditor.getValue();

      // Create script tag with id="json-editor-demo" and add it to page
      //insertScriptTag(code, 'json-editor-demo');

      // Evaluate code without inserting it on page
      if (evaluateCode(code)) document.querySelector('#tab1').checked = true;
    };

    /* Setup */

    // Add modal box events
    jeModalClose.addEventListener("click", toggleModal);
    window.addEventListener("click", closeModal);

    // Setup ACE editor for editing Schema
    aceSchemaEditor = window.ace.edit(jeEditSchema);
    aceSchemaEditor.setOptions({
      theme: aceTheme
    });
    aceSchemaEditor.session.setOptions({
      mode: 'ace/mode/json',
      tabSize: 2,
      useSoftTabs: true
    });

    // Setup ACE editor for editing Schema start values
    aceStartvalEditor = window.ace.edit(jeEditStartval);
    aceStartvalEditor.setOptions({
      theme: aceTheme
    });
    aceStartvalEditor.session.setOptions({
      mode: 'ace/mode/json',
      tabSize: 2,
      useSoftTabs: true
    });

    // Setup ACE editor for editing JavaScript
    aceCodeEditor = window.ace.edit(jeEditCode);
    aceCodeEditor.setOptions({
      theme: aceTheme
    });
    aceCodeEditor.session.setOptions({
      mode: 'ace/mode/javascript',
      tabSize: 2,
      wrap: true,
      useSoftTabs: true,
      useWrapMode: true,
      indentedSoftWrap: true
    });

    // Show error if JSON schema is invalid
    aceSchemaEditor.on("blur", showModalError.bind(aceSchemaEditor));

    // Set buttom event to restore initial value of ACE editor content.
    setRestoreButton(jeCodeRestore, aceCodeEditor);
    setRestoreButton(jeSchemaRestore, aceSchemaEditor);

    // Set button event for loading external schemas
    jeSchemaLoad.addEventListener('change', loadJSONFile);

    // Set button event for generating form
    jeExec.addEventListener('click', generateForm);

    // Create the direct link URL
    jeDirectLink.addEventListener('click', updateDirectLink);

    // Set event handler for string selectboxes
    jeTheme.addEventListener('change', getSelectValue);
    jeIconlib.addEventListener('change', getSelectValue);
    jeLayout.addEventListener('change', getSelectValue);
    jeErrors.addEventListener('change', getSelectValue);
    jeTemplate.addEventListener('change', getSelectValue);

    // Set event handler for boolean checkboxes
    jeBool.addEventListener('click', getCheckboxValue);
    jeExtlib.addEventListener('click', getCheckboxValue);

   // Create initial form
    var code = getCode(aceSchemaEditor.getValue(), '{}');// + aceCodeEditor.getValue();
    evaluateCode(code);
    //insertScriptTag(code, 'json-editor-demo');
  })();

//# sourceMappingURL=jsoneditor_demo.js.map