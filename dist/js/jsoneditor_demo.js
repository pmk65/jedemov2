 (function() {

 /*
  * ToDo:
  *  - Detect config changes and update iframe
  *  - Save/compare default values of Ace Editor content before creating Direct Link (No need to include the default values)
  *  - Move options to slide-in panel and remove useless <details> tags wrapping <select> tags.
  *  - Show error output (panel?) and form output
  *  - Code cleanup
  *  - Extend Load functionality so it can load Schema,Startval and JavaScript.
  *  - Functionality to save current setup (Schema,startval and JavaScript) and to upload it again.
  *  - Create an unified format for saved schemas (so startval and JavaScript can be included)
  */

    // value -> CSS/JavaScript mapping for external files
    var mapping = {
      theme: {
        bootstrap2: {
          css: 'https://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css'
        },
        bootstrap3: {
          css: 'https://cdn.jsdelivr.net/npm/bootstrap@3.4.0/dist/css/bootstrap.min.css',
          js: 'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/js/bootstrap.min.js'
        },
        bootstrap4: {
          css: 'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css'
        },
        foundation3: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/3.2.5/stylesheets/foundation.css'
        },
        foundation4: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/4.3.2/css/foundation.min.css'
        },
        foundation5: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/css/foundation.min.css'
        },
        foundation6: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.2/foundation.min.css',
          js: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.2/js/foundation.min.js'
        },
        jqueryui: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/south-street/jquery-ui.min.css'
        },
        materialize: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
          js: [
                'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js'
            ]
        }
      },
      iconlib: {
        foundation2: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/2.0/stylesheets/general_foundicons.min.css'
        },
        foundation3: {
          css: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/foundation-icons.min.css'
        },
        fontawesome3: {
          css: 'https://cdn.jsdelivr.net/npm/font-awesome@3.2.1/css/font-awesome.min.css'
        },
        fontawesome4: {
          css: 'https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css'
        },
        fontawesome5: {
          css: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css'
        },
        materialicons: {
          css: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      },
      template: {
        ejs: {
          js: 'https://cdn.jsdelivr.net/npm/ejs@2.6.1/lib/ejs.min.js'
        },
        handlebars: {
          js: 'https://cdn.jsdelivr.net/npm/handlebars@4.0.12/lib/index.min.js'
        },
        hogan: {
          js: 'https://cdn.jsdelivr.net/npm/hogan-updated@3.1.0/hogan.min.js'
        },
        markup: {
          js: 'https://cdn.jsdelivr.net/npm/markup-js@1.5.21/src/markup.min.js'
        },
        mustache: {
          js: 'https://cdn.jsdelivr.net/npm/mustache@3.0.1/mustache.min.js'
        },
        swig: {
          js: 'https://cdnjs.cloudflare.com/ajax/libs/swig/1.4.1/swig.min.js'
        },
        underscore: {
          js: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js'
        }
      },
      ext_lib: {
        lib_aceeditor: {
          js: 'https://cdn.jsdelivr.net/npm/ace-editor-builds@1.2.4/src-min-noconflict/ace.js'
        },
        lib_cleavejs: {
          js: 'https://cdn.jsdelivr.net/npm/cleave.js@1.4.7/dist/cleave.min.js'
        },
        lib_sceditor: {
          css: 'https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/themes/default.min.css',
          js: [
            'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js',
            'https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/sceditor.min.js',
            'https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/formats/bbcode.js',
            'https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/formats/xhtml.js'
          ]
        },
        lib_simplemde: {
          css: 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css',
          js: 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js'
        },
        lib_select2: {
          css: 'https://cdn.jsdelivr.net/npm/select2@4.0.6-rc.1/dist/css/select2.min.css',
          js: [
            'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js',
            'https://cdn.jsdelivr.net/npm/select2@4.0.6-rc.1/dist/js/select2.min.js'
          ]
        },
        lib_selectize: {
          css: [
            'https://cdn.jsdelivr.net/npm/selectize@0.12.6/dist/css/selectize.min.css',
            'https://cdn.jsdelivr.net/npm/selectize@0.12.6/dist/css/selectize.default.min.css'
          ],
          js: 'https://cdn.jsdelivr.net/npm/selectize@0.12.6/dist/js/standalone/selectize.min.js'
        },
        lib_flatpickr: {
          css: 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
          js: 'https://cdn.jsdelivr.net/npm/flatpickr'
        },
        lib_signaturepad: {
          js: 'https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js'
        },
        lib_mathjs: {
          js: 'https://cdn.jsdelivr.net/npm/mathjs@5.3.1/dist/math.min.js'
        }
      }
    };

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
    var jeIframeEl = document.querySelector('iframe');
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
    var jeTabs = document.querySelector('nav.tabs'); // Tabs (Wrapper, not single buttons)

    var jeDropZone = document.querySelector('#dropzone'); // Drag'n'Drop upload zone


    /* Helper functions */

    // Tests if JSON schema is invalid. Returns errormsg if invalid
    var isInvalidJson = function(code) {
      try { JSON.parse(code); }
      catch(e) { return 'Invalid Schema: ' + e.message.charAt(12).toUpperCase() + e.message.slice(13); }
      return false;
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

    // Function to handle clicks on Tab buttons
    var tabsHandler = function(e) {
      if (e.target && e.target.nodeName == 'BUTTON') {
        var buttons = this.querySelectorAll('button');
        for (var i=0;i<buttons.length;i++) {
          buttons[i].classList.remove('active');
          document.querySelector(buttons[i].dataset.content).classList.remove('active');
        }
        e.target.classList.add('active');
        document.querySelector(e.target.dataset.content).classList.add('active');
      }
    };

    // function to catch errors thrown inside iframe
    window.iframeErrorCatcher = function(err) {
        jeModalContent.innerText = err.message;
        toggleModal();
    };

    // Fullscreen Drag'n'Drop upload handlers
    function showDropZone() {
      jeDropZone.style.display = "block";
    }
    function hideDropZone() {
      jeDropZone.style.display = "none";
    }
    function allowDrag(e) {
      var dt = e.dataTransfer;
      e.dataTransfer.dropEffect = dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files')) ? 'copy' : 'none';
      e.preventDefault();
    }
    function handleDrop(e) {
      e.preventDefault();
      hideDropZone();
      var file = e.dataTransfer.files[0];
      if (file.type != 'application/json' || file.size === 0) {
        jeModalContent.innerText = 'Error: File uploaded is not a .JSON file';
        toggleModal();
        return;
      }

      var reader = new FileReader();
      reader.onload = function(e) {
        var response = e.target.result;
        var err = isInvalidJson(response);
        if (err) {
          jeModalContent.innerText = err;
          toggleModal();
        }
        else {
          aceSchemaEditor.setValue(response);
          aceSchemaEditor.session.getSelection().clearSelection();
        }
      };
      reader.readAsText(file);
    }


    // Convert URL GET parameters into object or return value if key is supplied
    var getUrlParams = function(key) {
      var prmstr = window.location.search.substr(1), params = {};
      if (prmstr != null && prmstr !== "") {
        var prmarr = prmstr.split("&");
        for ( var i = 0; i < prmarr.length; i++) {
          var tmparr = prmarr[i].split("=");
          if (typeof key != 'undefined' && key == tmparr[0]) {
            params = tmparr[1];
            break;
          }
          params[tmparr[0]] = tmparr[1];
        }
      }
      return params;
    };

    // Convert object into query string
    function toQueryString(obj) {
      var parts = [];
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
      }
      return parts.join("&");
    }

    // Get options object from checkboxes and selectboxes
    // if "data-json-editor-special" is set on tag, it will not be included
    var getJsonEditorOptions = function() {
      var options = {},
          cfg = document.querySelector('#json-editor-confg'),
          exclude = ':not([data-json-editor-special])',
          els = cfg.querySelectorAll('input[type="checkbox"]' + exclude + ',select' + exclude);
      Array.from(els).forEach(function(el) {
        if (el.tagName == 'SELECT') options[el.id] = el.value;
        else if (el.checked) options[el.value] = 1;//el.checked;
      });
      //console.log('options', options);
      return options;
    };

    // Create Direct Link URL with query parameters
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

    // Clear query parameters from URL
    var resetUrl = function() {
      if (confirm('Clear URL query parameters?')) {
        updateDirectLink(true);
      }
    };

    // Set config options based on query parameters
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

    // Build codeblock to create JSON-Editor instance
    var getCode = function(schema, startval) {
      return 'if (jsoneditor) jsoneditor.destroy();jsoneditor = new window.JSONEditor(document.querySelector("#json-editor-form"),{schema: ' + schema + ', startval: ' + startval + '});';
    };

    // Filter out duplicates from array
    var uniqueArray = function(arr) {
      var seen = {};
      return arr.filter(function(item) {
          return seen.hasOwnProperty(item) ? false : seen[item] = true;
      });
    };

      // Build list of external files to include in Iframe
    var buildExtFiles = function(options) {
      var jsFiles = [], cssFiles = [], extFiles = '', map;
      for (var i in options) {
        if (options.hasOwnProperty(i) && (mapping.ext_lib[i] || mapping[i] && mapping[i][options[i]])) {
          map = mapping.ext_lib[i] || mapping[i][options[i]];
          if (map.js) jsFiles = jsFiles.concat(typeof map.js == 'string' ? [map.js] : map.js);
          if (map.css) cssFiles = cssFiles.concat(typeof map.css == 'string' ? [map.css] : map.css);
        }
      }
      if (cssFiles) extFiles += '<link rel="stylesheet" href="' + uniqueArray(cssFiles).join('" /><\/link><link rel="stylesheet" href="') + '" /><\/link>';
      if (jsFiles) extFiles += '<script src="' + uniqueArray(jsFiles).join('" /><\/script><script src="') + '" /><\/script>';
      return extFiles;
    };

    var buildEditorOptions = function(options) {
      var res = '';
      for (var i in options) {
        if (options.hasOwnProperty(i) && !/^lib_/.test(i)) {
          var val = typeof options[i] == 'string' ? '"' + options[i] + '"' : options[i];
          res += 'JSONEditor.defaults.options["' + i + '"] = ' + val + ';\n';
        }
      }
      return '<script>' + res + '</script>';
    };

    // Create page for Iframe
    var createIframeContent = function(code) {
      var options = getJsonEditorOptions();
      return  '<!DOCTYPE HTML>' +
              '<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"><style>' +
              'body {margin:0;padding:0;font: normal 1em/1 Arial;background-color:#f8f8f8 !important;}' +
              '.inner-row {background-color: #fff;position: relative;max-width: 1200px;left:50%;transform: translate(-50%,0);padding: 1rem 2rem;box-shadow: 2px 0 5px rgba(0,0,0,.2);}' +
              '</style><script src="https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js"><\/script>' +
              buildExtFiles(options) +
              buildEditorOptions(options) +
              '</head><body>' +
              '<div class="inner-row"><div id="json-editor-form"></div></div>' +
              '<script>var jsoneditor;' +
              'try{' +
              code +
               //';for (var i=0;i<399;i++) {document.write(i+"<br>");};' +  // Iframe scrollbar testing
               '}catch(err){window.top.iframeErrorCatcher(err);};' +
               '<\/script>' +
              '</body></html>';
    };

    // Load external JSON file
    var loadFile = function(file, mimeType, callback) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType(mimeType);
      xobj.open('GET', file, true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') {
          callback(xobj.responseText);
        }
      };
      xobj.send(null);
    };

    // Change event handler - Load selected JSON Schema into editor
    // Does not work locally due to CORS policy
    var loadExampleFiles = function() {
      var example = this.options[this.selectedIndex].value;
      if (example) {
        loadFile('examples/schema/' + example + '.json', 'application/json', function(response) {
          aceSchemaEditor.setValue(response);
          aceSchemaEditor.session.getSelection().clearSelection();
        });
        loadFile('examples/startval/' + example + '.json', 'application/json', function(response) {
          aceStartvalEditor.setValue(response);
          aceStartvalEditor.session.getSelection().clearSelection();
        });
        loadFile('examples/javascript/' + example + '.js', 'application/javascript', function(response) {
          aceCodeEditor.setValue(response);
          aceCodeEditor.session.getSelection().clearSelection();
        });
      }
    };

    // Change event handler - for Options selectboxes
    var getSelectValue = function() {
      var key = this.id, val = this.value;
      //jeIframe.window.JSONEditor.defaults.[key] = val;
       console.log('String option "' + key + '" changed to "' + val + '"');
    };

    var getCheckboxValue = function(e) {
      if (e.target.type == 'checkbox') {
        console.log('Boolean option "' + e.target.value + '" changed to "' + e.target.checked.toString() + '"');
        //jeIframe.window.JSONEditor.defaults[e.target.value] = e.target.checked;
      }
    };

    // Trigger event on element
    var eventFire = function(el, etype){
      if (el.fireEvent) el.fireEvent('on' + etype);
      else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
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

    // Click event handler - Creates the form from the JSON schema
    var generateForm = function(e) {
      e.preventDefault();

      // Get content of ACE editor schema, startval and JavaScript;
      var code = getCode(aceSchemaEditor.getValue(), aceStartvalEditor.getValue()) + aceCodeEditor.getValue();

      jeIframe.document.open();
      jeIframe.document.write(createIframeContent(code)); // Iframe method
      jeIframe.document.close();

      eventFire(document.querySelector('nav.tabs button'), 'click');
   };

    /* Setup */

    // Onload event for Iframe
    jeIframe.addEventListener('load', function() {
      console.log('jeIframe.window.JSONEditor.defaults', jeIframe.window.JSONEditor.defaults);
    });

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

    // Sett events on tabs buttons
    jeTabs.addEventListener('click', tabsHandler);

    // Set button event for loading external schemas
    if (window.location.protocol != 'file:') jeSchemaLoad.addEventListener('change', loadExampleFiles);
    else {
      jeSchemaLoad.disabled = true;
      jeSchemaLoad.title = 'Not available locally due to CORS policy';
    }

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

    // Set Drag'n'Drop handlers
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      window.addEventListener('dragenter', showDropZone);
      jeIframe.addEventListener('dragenter', showDropZone);
      jeDropZone.addEventListener('dragenter', allowDrag);
      jeDropZone.addEventListener('dragover', allowDrag);
      jeDropZone.addEventListener('dragleave', hideDropZone);
      jeDropZone.addEventListener('drop', handleDrop);
    }

    // Update fields from query parameters
    updateFromUrl();

   // Create initial form
    var code = getCode(aceSchemaEditor.getValue(), aceStartvalEditor.getValue()) + aceCodeEditor.getValue();

    jeIframe.document.open();
    jeIframe.document.write(createIframeContent(code)); // Iframe method
    jeIframe.document.close();

  })();

//# sourceMappingURL=jsoneditor_demo.js.map