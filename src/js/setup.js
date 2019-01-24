/*jshint -W054 */
 (function() {

    var globalTest = "i am LOCAL"; // Dummy test var


    // Error Modal box
    var modal = document.querySelector(".modal");
    var modalContent = modal.querySelector("p");
    var modalClose = modal.querySelector(".close-button");

    var toggleModal = function() {
      modal.classList.toggle("show-modal");
    };

    var windowOnClick = function(e) {
      if (e.target === modal) toggleModal();
    };

    modalClose.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);

    var aceTheme = 'ace/theme/github';

    // Setup ACE editor for editing Schema
    var aceSchemaEditor = window.ace.edit("schema");
    aceSchemaEditor.setOptions({
      theme: aceTheme,
    });
    aceSchemaEditor.session.setOptions({
      mode: 'ace/mode/json',
      tabSize: 2,
      useSoftTabs: true
    });

    // Setup ACE editor for editing Schema start values
    var aceStartvalEditor = window.ace.edit("schema");
    aceStartvalEditor.setOptions({
      theme: aceTheme,
    });
    aceStartvalEditor.session.setOptions({
      mode: 'ace/mode/json',
      tabSize: 2,
      useSoftTabs: true
    });

    // Setup ACE editor for editing JavaScript
    var aceCodeEditor = window.ace.edit("editor");
    aceCodeEditor.setOptions({
      theme: aceTheme,
    });
    aceCodeEditor.session.setOptions({
      mode: 'ace/mode/javascript',
      tabSize: 2,
      wrap: true,
      useSoftTabs: true,
      useWrapMode: true,
      indentedSoftWrap: true
    });

    // Tests if JSON schema is invalid. Returns errormsg if invalid
    var isInvalidJson = function(code) {
      try { JSON.parse(code); }
      catch(e) { return 'Invalid Schema: ' + e.message.charAt(12).toUpperCase() + e.message.slice(13); }
      return false;
    };

    // Show error if JSON schema is invalid
    aceSchemaEditor.on("blur", function() {
      var res = isInvalidJson(this.getValue());
      if (res) {
        modalContent.innerText = res;
        toggleModal();
      }
    }.bind(aceSchemaEditor));

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

    document.querySelector('#external-schema').addEventListener('change', function() {
      var file = this.options[this.selectedIndex].value;
      if (file) {
        loadJSON(file, function(response) {
          aceSchemaEditor.setValue(response);
          aceSchemaEditor.session.getSelection().clearSelection();
        });
      }

    });

    // Set restore to default for ACE Editor
    var setRestoreButton = function(sel, ed) {
      document.querySelector(sel).addEventListener('click', function(def, e) {
        e.preventDefault();
        this.setValue(def);
        this.session.getSelection().clearSelection();
      }.bind(ed, ed.getValue()));
    };

    // Set buttom event to restore initial value of ACE editor content.
    setRestoreButton('#restore-code', aceCodeEditor);

    // Set buttom event to restore initial value of ACE editor content.
    setRestoreButton('#restore-schema', aceSchemaEditor);

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

    // Evaluate code without inserting it on page
    var evaluateCode = function(code, strict) {
      if (strict) {
        //"use strict";
        code = '"use strict";' + code;
      }
      try {
        new Function(code)();
      }
      catch(e) {
        modalContent.innerText = e.message;
        toggleModal();
      }
    };

    var executeCodeButton = document.querySelector('#execute-code');
    executeCodeButton.addEventListener('click', function(e) {
      e.preventDefault();

      // Get content of ACE editor schema and JavaScript;
      var code = getCode(aceSchemaEditor.getValue(), '{}') + aceCodeEditor.getValue();

      // Create script tag with id="json-editor-demo" and add it to page
      //insertScriptTag(code, 'json-editor-demo');

      // Evaluate code without inserting it on page
      evaluateCode(code);
      document.querySelector('#tab1').checked = 1;

    });

    var code = getCode(aceSchemaEditor.getValue(), '{}') + aceCodeEditor.getValue();
    // Create initial form
    evaluateCode(code);
    //insertScriptTag(code, 'json-editor-demo');
  })();
