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

    // Iframe
    var jeIframeEl = document.querySelector('#iframe-container iframe');
    var jeIframe = jeIframeEl.contentWindow || ( jeIframeEl.contentDocument.document || jeIframeEl.contentDocument);

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
    var jeStartvalRestore = document.querySelector('#restore-startval'); // Restore initial value of ACE editor
    var jeExec = document.querySelector('#execute-code'); // Create form from Schema
    var jeDirectLink = document.querySelector('#direct_link'); // Create direct link url
    var jeUrlReset = document.querySelector('#direct_link_reset'); // Clear query params from url


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
        if (el.tagName == 'INPUT' && el.checked) options[el.value] = 1;//el.checked;
        else if (el.tagName == 'SELECT' && el.value !== '') options[el.id] = el.value;
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
    var updateDirectLink = function(e) {
      var url = window.location.toString().replace(window.location.search, "");
      if (e.target == jeDirectLink) {
        url += '?schema=' + window.LZString.compressToBase64(JSON.stringify(aceSchemaEditor.getValue()));
//        url += '&value=' +  window.LZString.compressToBase64(JSON.stringify(window.jsoneditor.getValue()));
        url += '&value=' +  window.LZString.compressToBase64(JSON.stringify(aceStartvalEditor.getValue()));
        url += '&code=' + window.LZString.compressToBase64(JSON.stringify(aceCodeEditor.getValue()));
        url += '&'+ toQueryString(getJsonEditorOptions());
      }
      //window.location.href = url;
      //window.location.assign(url);
      window.location.replace(url);
    };

    var updateFromUrl = function() {
      var params = getUrlParams();
      if (params.code) {
        aceCodeEditor.setValue(JSON.parse(window.LZString.decompressFromBase64(params.code)));
        aceCodeEditor.session.getSelection().clearSelection();
        delete params.code;
      }
      if (params.schema) {
        aceSchemaEditor.setValue(JSON.parse(window.LZString.decompressFromBase64(params.schema)));
        aceSchemaEditor.session.getSelection().clearSelection();
        delete params.schema;
      }
      if (params.value) {
        aceStartvalEditor.setValue(JSON.parse(window.LZString.decompressFromBase64(params.value)));
        aceStartvalEditor.session.getSelection().clearSelection();
        delete params.value;
      }
      for (var id in params) {
        if (params.hasOwnProperty(id)) {
          var el = document.querySelector('#'+ id);
          if (el) {
            if (el.tagName == 'SELECT') el.value = params[id];
            else if (el.tagName == 'INPUT') el.checked = true;
          }
        }
      }
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

    var reload = function(keep_value) {
    };

     // Set the theme by loading the right stylesheets
    var setTheme = function(theme,no_reload) {
        theme = theme || '';

        var mapping = {
            barebones: '',
            html: '',
            bootstrap2: 'https://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css',
            bootstrap3: 'https://cdn.jsdelivr.net/npm/bootstrap@3.4.0/dist/css/bootstrap.min.css',
            bootstrap4: 'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css',
            foundation3: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/3.2.5/stylesheets/foundation.css',
            foundation4: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/4.3.2/css/foundation.min.css',
            foundation5: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/css/foundation.min.css',
            foundation6: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.2/foundation.min.css',
            jqueryui: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/south-street/jquery-ui.min.css',
            materialize: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'
        };

        if(typeof mapping[theme] === 'undefined') {
            theme = 'bootstrap3';
            document.getElementById('theme_switcher').value = theme;
        }

        var scriptMapping = {
            bootstrap4: 'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/js/bootstrap.min.js',
            foundation6: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.2/js/foundation.min.js',
            materialize: [
                'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js'
            ]
        };

        var themeScripts = scriptMapping[theme],
            head = document.getElementsByTagName('head')[0],
            script;

        if (typeof themeScripts == 'string') { themeScripts = [themeScripts]; }
        if (Array.isArray(themeScripts)) {
            for (var i = 0; i < themeScripts.length; i++) {
                script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = themeScripts[i];
                head.appendChild(script);
            }
        }

        window.JSONEditor.defaults.options.theme = theme;

        document.getElementById('theme_stylesheet').href = mapping[theme];
        document.getElementById('theme_switcher').value = window.JSONEditor.defaults.options.theme;

        if(!no_reload) reload(true);
    };

     // Set the icontheme by loading the right stylesheets
    var setIconlib = function(iconlib,no_reload) {
        iconlib = iconlib || '';
        var mapping = {
            foundation2: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/2.0/stylesheets/general_foundicons.min.css',
            foundation3: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/foundation-icons.min.css',
            fontawesome3: 'https://cdn.jsdelivr.net/npm/font-awesome@3.2.1/css/font-awesome.min.css',
            fontawesome4: 'https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css',
            fontawesome5: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css',
            materialicons: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        };

        window.JSONEditor.defaults.options.iconlib = iconlib;

        document.getElementById('icon_stylesheet').href = mapping[iconlib] || '';
        document.getElementById('icon_switcher').value = window.JSONEditor.defaults.options.iconlib;

        if(!no_reload) reload(true);
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

    var createIframeContent = function(code) {
      return  '<!DOCTYPE HTML>' +
              '<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8">' +
              '<script src="https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js"></script>' +
              '</head><body>' +
              '<div id="json-editor-form"></div>' +
              '<script>var jsoneditor;' +
              'try{' +
               code + ';for (var i=0;i<399;i++) {document.write(i+"<br>");};' +
               '}catch(err){window.top.iframeErrorCatcher(err);};' +
               '</script>' +
              '</body></html>';
    };

    // Clear query parameters from URL
    var resetUrl = function(e) {
      if (confirm('Clear URL query parameters?')) {
        updateDirectLink(true);
      }
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

    // function to catch errors thrown inside iframe
    window.iframeErrorCatcher = function(err) {
        jeModalContent.innerText = err.message;
        toggleModal();
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
      var key = this.id, val = this.value;
      switch(key) {
        case 'theme':
          //setTheme(this.value);
        break;
        case 'iconlib':
          //setIconlib(this.value);
        break;
/*        case 'template':
        break;*/
        default:
          window.JSONEditor.defaults.options[key] = val;
          reload(true);
        break;
       }
       console.log('String option "' + key + '" changed to "' + val + '"');
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
      var code = getCode(aceSchemaEditor.getValue(), aceStartvalEditor.getValue()) + aceCodeEditor.getValue();

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

    // Show error if JSON schema or startval is invalid
    aceSchemaEditor.on("blur", showModalError.bind(aceSchemaEditor));
    aceStartvalEditor.on("blur", showModalError.bind(aceStartvalEditor));

    // Set buttom event to restore initial value of ACE editor content.
    setRestoreButton(jeCodeRestore, aceCodeEditor);
    setRestoreButton(jeSchemaRestore, aceSchemaEditor);
    setRestoreButton(jeStartvalRestore, aceStartvalEditor);

    // Set button event for loading external schemas
    jeSchemaLoad.addEventListener('change', loadJSONFile);

    // Set button event for generating form
    jeExec.addEventListener('click', generateForm);

    // Create the direct link URL
    jeDirectLink.addEventListener('click', updateDirectLink);
    jeUrlReset.addEventListener('click', resetUrl);

    // Set event handler for string selectboxes
    jeTheme.addEventListener('change', getSelectValue);
    jeIconlib.addEventListener('change', getSelectValue);
    jeLayout.addEventListener('change', getSelectValue);
    jeErrors.addEventListener('change', getSelectValue);
    jeTemplate.addEventListener('change', getSelectValue);

    // Set event handler for boolean checkboxes
    jeBool.addEventListener('click', getCheckboxValue);
    jeExtlib.addEventListener('click', getCheckboxValue);

    // Update fields from query parameters
    updateFromUrl();

   // Create initial form
    var code = getCode(aceSchemaEditor.getValue(), aceStartvalEditor.getValue()) + aceCodeEditor.getValue();
    //evaluateCode(code); // Evaluate method
    //insertScriptTag(code, 'json-editor-demo');  // Inject method
    jeIframe.document.open();
    jeIframe.document.write(createIframeContent(code)); // Iframe method
    jeIframe.document.close();

  })();
