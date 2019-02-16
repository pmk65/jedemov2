(function() {

 /*
  * ToDo:
  *  - Save/compare default values of Ace Editor content before creating Direct Link (No need to include the default values)
  *  - Url shortener for direct link. 
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
          css: 'https://cdn.jsdelivr.net/npm/foundation-sites@6.5.3/dist/css/foundation.min.css',
          js: [
            'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js',
            'https://cdn.jsdelivr.net/npm/foundation-sites@6.5.3/dist/js/foundation.min.js'
          ]
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
          js: 'https://cdn.jsdelivr.net/npm/ejs@latest/lib/ejs.min.js'
        },
        handlebars: {
          js: 'https://cdn.jsdelivr.net/npm/handlebars@latest/lib/index.min.js'
        },
        hogan: {
          js: 'https://cdn.jsdelivr.net/npm/hogan-updated@latest/hogan.min.js'
        },
        markup: {
          js: 'https://cdn.jsdelivr.net/npm/markup-js@latest/src/markup.min.js'
        },
        mustache: {
          js: 'https://cdn.jsdelivr.net/npm/mustache@latest/mustache.min.js'
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
          js: [
          'https://cdn.jsdelivr.net/npm/ace-builds@latest/src-noconflict/ace.min.js',
          'https://cdn.jsdelivr.net/npm/ace-builds@latest/src-noconflict/mode-json.js',
          'https://cdn.jsdelivr.net/npm/ace-builds@latest/src-noconflict/mode-javascript.js'
          ]
        },
        lib_cleavejs: {
          js: [
          'https://cdn.jsdelivr.net/npm/cleave.js@latest/dist/cleave.min.js',
          'https://cdn.jsdelivr.net/npm/cleave.js@latest/dist/addons/cleave-phone.i18n.min.js'
          ]
        },
        // JSON-Editor doesn't work correctly with latest version of SCEditor
        lib_sceditor_new: {
          css: 'https://cdn.jsdelivr.net/npm/sceditor@latest/minified/themes/default.min.css',
          js: [
            'https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js',
            //'https://cdn.jsdelivr.net/npm/sceditor@latest/minified/sceditor.min.js',
            'https://cdn.jsdelivr.net/npm/sceditor@latest/minified/jquery.sceditor.min.js',
            'https://cdn.jsdelivr.net/npm/sceditor@latest/minified/formats/bbcode.js',
            'https://cdn.jsdelivr.net/npm/sceditor@latest/minified/formats/xhtml.js'
          ]
        },
        lib_sceditor: {
          css: [
            'https://cdn.jsdelivr.net/sceditor/1.4.3/jquery.sceditor.default.min.css',
            'https://cdn.jsdelivr.net/sceditor/1.4.3/themes/default.min.css'
          ],
          js: [
            'https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js',
            'https://cdn.jsdelivr.net/sceditor/1.4.3/jquery.sceditor.xhtml.min.js',
            'https://cdn.jsdelivr.net/sceditor/1.4.3/jquery.sceditor.bbcode.min.js'
          ]
        },
        lib_simplemde: {
          css: 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css',
          js: 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js'
        },
        lib_select2: {
          css: 'https://cdn.jsdelivr.net/npm/select2@4.0.6-rc.1/dist/css/select2.min.css',
          js: [
            'https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js',
            'https://cdn.jsdelivr.net/npm/select2@4.0.6-rc.1/dist/js/select2.min.js'
          ]
        },
        lib_selectize: {
          css: [
            'https://cdn.jsdelivr.net/npm/selectize@latest/dist/css/selectize.min.css',
            'https://cdn.jsdelivr.net/npm/selectize@latest/dist/css/selectize.default.min.css'
          ],
          js: [
            'https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js',
            'https://cdn.jsdelivr.net/npm/selectize@latest/dist/js/standalone/selectize.min.js'
          ]
        },
        lib_flatpickr: {
          css: 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
          js: 'https://cdn.jsdelivr.net/npm/flatpickr'
        },
        lib_signaturepad: {
          js: 'https://cdn.jsdelivr.net/npm/signature_pad@latest/dist/signature_pad.min.js'
        },
        lib_mathjs: {
          js: 'https://cdn.jsdelivr.net/npm/mathjs@latest/dist/math.min.js'
        },
        lib_jquery: {
          js: 'https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js'
        }
      }
    };

    // Theme to use in ACE editor instances
    //var aceTheme = 'ace/theme/github';
    var aceTheme = 'ace/theme/vibrant_ink';

    // ACE Editor Beautify extension
    var aceBeautify = window.ace.require("ace/ext/beautify"); // get reference to extension

    // ACE Editor placeholders
    var jeEditSchema = document.querySelector('#schema');
    var jeEditStartval = document.querySelector('#startval');
    var jeEditCode = document.querySelector('#editor');
    var jeEditCSS = document.querySelector('#csseditor');
    var jeOutput = document.querySelector('#output');  // Form output
    var jeValidate = document.querySelector('#validate');  // Validation output

    // ACE Editor instances
    var aceCodeEditor;
    var aceStyleEditor;
    var aceSchemaEditor;
    var aceStartvalEditor;
    var aceOutputEditor;
    var aceValidateEditor;

    // Error Modal box
    var jeModal = document.querySelector(".modal");
    var jeModalContent = jeModal.querySelector("p");
    var jeModalClose = jeModal.querySelector(".close-button");

    // Iframe
    var jeIframeEl = document.querySelector('iframe');
    var jeIframe = jeIframeEl.contentWindow || ( jeIframeEl.contentDocument.document || jeIframeEl.contentDocument);

    // Options Checkboxes (Wrapper, not single checkboxes)
    var jeCfg = document.querySelector('#json-editor-config'); // Config wrapper
    var jeExtlib = document.querySelector('#ext_lib');

    // Example description placeholder
    var jeExampleDesc = document.querySelector('#example-description');

    // Buttons
    var jeSchemaLoad = document.querySelector('#external-schema'); // Load schema
    var jeExec = document.querySelector('#execute-code'); // Create form from Schema
    var jeSetValue = document.querySelector('#execute-setvalue'); // Create form from Schema
    var jeDirectLink = document.querySelector('#direct_link'); // Create direct link url
    var jeUrlReset = document.querySelector('#direct_link_reset'); // Clear query params from url
    var jeTabs = document.querySelector('nav.tabs'); // Tabs (Wrapper, not single buttons)
    var jeDownloadExample = document.querySelector('#download_example');
    var jeUploadExample = document.querySelector('#upload_example');

    var jeFileUpload = document.querySelector('input[type="file"]');
    var jeDropZone = document.querySelector('#dropzone'); // Drag'n'Drop upload zone

    // Split panels
    var jeSplitCfg = {
        sizes: [75, 25],
        minSize: [200,200],
        onDragEnd: function() {
          aceCodeEditor.resize();
          aceStyleEditor.resize();
          aceSchemaEditor.resize();
          aceStartvalEditor.resize();
          aceOutputEditor.resize();
          aceValidateEditor.resize();
        },
        gutter: function () {
            var gutter = document.createElement('div');
            gutter.className = 'split-gutter';
            gutter.style.height = '560px';
            return gutter;
        },
        gutterSize: 4
    };
    var jeSplitPanels = [
      ['#split-panel1', '#split-panel2'],
      ['#split-panel3', '#split-panel4'],
      ['#split-panel5', '#split-panel6']
    ];

    var jeBusyOverlay = document.querySelector('#busy-overlay'); // Busy overlay

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
      var val = this.getValue();
      if (val.trim()) {
        var res = isInvalidJson(val);
        if (res) {
          jeModalContent.innerText = res;
          toggleModal();
        }
      }
    };

    // Trigger event on element
    var eventFire = function(el, etype){
      if (el.fireEvent) el.fireEvent('on' + etype);
      else {
        el.dispatchEvent(new Event(etype,{
          'bubbles': true,
          'cancelable': false
        }));
      }
    };

    // Trigger mouse click event
    var eventClickFire = function(el) {
      el.dispatchEvent(new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      }));
    };

    // copy text to clipboard
    var copyToClipboard = function(txt) {
      var ta = document.createElement('textarea');
      ta.value = txt;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
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

        // Required for ACE editor to update the content after "display: hidden"
        aceSchemaEditor.resize();
        aceStartvalEditor.resize();
        aceCodeEditor.resize();
        aceStyleEditor.resize();
        aceOutputEditor.resize();
        aceValidateEditor.resize();

      }
    };

    // function to catch errors thrown inside iframe
    window.iframeErrorCatcher = function(err) {
        jeModalContent.innerText = err;
        toggleModal();
    };

    // catch form output and validation errors from inside iframe
    window.iframeOutputCatcher = function(json, validation_errors, na) {
      var bu = document.querySelector('button[data-content="#content5"]');
      bu.style.display = na === 1 ? 'none' : 'initial';
      if (na !== 1) {
        aceOutputEditor.setValue(JSON.stringify(json, null, 2));
        aceOutputEditor.session.getSelection().clearSelection();
        aceOutputEditor.resize();
        // Show validation errors if there are any
        var val = validation_errors.length ? validation_errors : {'schema': 'valid'};
        aceValidateEditor.setValue(JSON.stringify(val, null, 2));
        aceValidateEditor.session.getSelection().clearSelection();
        aceValidateEditor.resize();
      }
    };

    // Update values in schema from output JSON
    var updateSchemaValues = function() {
      // this = aceOutputEditor
      var json;
      try {
        json = JSON.parse(this.getValue());
      }
      catch (err) {
        jeModalContent.innerText = err;
        toggleModal();
        return;
      }
      jeIframe.updateSchemaValuesIframe(json);
    };

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
    var toQueryString = function(obj) {
      var parts = [];
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
      }
      return parts.join("&");
    };

    // Get options object from checkboxes and selectboxes
    // if "data-json-editor-special" is set on tag, it will not be included
    var getJsonEditorOptions = function() {
      var options = {},
          exclude = ':not([data-json-editor-special])',
          els = jeCfg.querySelectorAll('input[type="checkbox"]' + exclude + ',select' + exclude);
      Array.from(els).forEach(function(el) {
        if (el.tagName == 'SELECT') options[el.id] = el.value;
        else if (el.checked) options[el.value] = 1;//el.checked;
      });
      return options;
    };

    // Create Direct Link URL with query parameters
    var updateDirectLink = function(e) {
      var url = window.location.toString().replace(window.location.search, "");
      if (e.target == jeDirectLink) {
        url += '?schema=' + window.LZString.compressToBase64(JSON.stringify(aceSchemaEditor.getValue().trim()));
//        url += '&value=' +  window.LZString.compressToBase64(JSON.stringify(window.jsoneditor.getValue()));
        url += '&value=' +  window.LZString.compressToBase64(JSON.stringify(aceStartvalEditor.getValue().trim()));
        url += '&code=' + window.LZString.compressToBase64(JSON.stringify(aceCodeEditor.getValue().trim()));
        url += '&style=' + window.LZString.compressToBase64(JSON.stringify(aceStyleEditor.getValue().trim()));
        url += '&'+ toQueryString(getJsonEditorOptions());
      }
      //window.location.href = url;
      //window.location.assign(url);
      copyToClipboard(url);
      window.location.replace(url);
    };

    // Clear query parameters from URL
    var resetUrl = function() {
      if (confirm('Clear URL query parameters?')) {
        updateDirectLink(true);
      }
    };

    // Set editors and config options based on JSON object
    var updateFromFile = function(response) {
      var example = JSON.parse(response),
          schema = JSON.stringify(example.schema, null, 2),
          startval = Object.keys(example.startval).length !== 0 ? JSON.stringify(example.startval, null, 2) : '',
          cfg = example.config,
          code = example.code,
          style = example.style,
          desc = example.desc;

        // Clear include external library checkboxes
        Array.from(jeExtlib.querySelectorAll('input')).forEach(function(el) {
          el.checked = false;
        });

        jeExampleDesc.innerHTML = '';

      // Add description of example to help page
      if (desc !== '' && desc != 'Add optional description here. (HTML format)') {
        jeModalContent.innerHTML = jeExampleDesc.innerHTML = '<h3>Info about "' + example.title + '" Example</h3>' + desc;
      toggleModal();
      }

      // Update ACE Editor instances
      aceSchemaEditor.setValue(schema);
      aceSchemaEditor.session.getSelection().clearSelection();
      aceSchemaEditor.resize();

      aceStartvalEditor.setValue(startval);
      aceStartvalEditor.session.getSelection().clearSelection();
      aceStartvalEditor.resize();

      aceCodeEditor.setValue(code);
      aceCodeEditor.session.getSelection().clearSelection();
      aceCodeEditor.resize();

      aceStyleEditor.setValue(style);
      aceStyleEditor.session.getSelection().clearSelection();
      aceStyleEditor.resize();

      aceOutputEditor.resize();
      aceValidateEditor.resize();

      // Set config options
      for (var id in cfg) {
        if (cfg.hasOwnProperty(id)) {
          var el = jeCfg.querySelector('#' + id);
          if (el) {
            if (el.nodeName == 'INPUT' && el.type == 'checkbox') el.checked = cfg[id];
            else if (el.nodeName == 'SELECT') el.value = cfg[id];
          }
        }
      }

      // Trigger generation of form
      eventFire(jeExec, 'click');

    };

    // Set editors and config options based on query parameters
    var updateFromUrl = function() {
      var params = getUrlParams();
      if (params.code) {
        aceCodeEditor.setValue(JSON.parse(window.LZString.decompressFromBase64(params.code)));
        aceCodeEditor.session.getSelection().clearSelection();
        delete params.code;
      }
      if (params.style) {
        aceStyleEditor.setValue(JSON.parse(window.LZString.decompressFromBase64(params.style)));
        aceStyleEditor.session.getSelection().clearSelection();
        delete params.style;
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

      aceSchemaEditor.resize();
      aceStartvalEditor.resize();
      aceCodeEditor.resize();
      aceStyleEditor.resize();
      aceOutputEditor.resize();
      aceValidateEditor.resize();

      for (var id in params) {
        if (params.hasOwnProperty(id)) {
          var el = document.querySelector('#'+ id);
          if (el) {
            if (el.tagName == 'SELECT') el.value = params[id];
            else if (el.tagName == 'INPUT') el.checked = true;
          }
        }
      }

      // Trigger generation of form
      eventFire(jeExec, 'click');
    };

    // Build codeblock to create JSON-Editor instance
    var getCode = function(schema, startval) {
      var opt = 'schema:' + schema + (startval.trim() ? ', startval:' + startval : '');
      return 'if (jseditor) jseditor.destroy();jseditor = new window.JSONEditor(document.querySelector("#json-editor-form"),{' + opt + '});';
    };

    // Fullscreen Drag'n'Drop upload handlers
    var showDropZone = function() {
      jeDropZone.style.display = "block";
    };
    var hideDropZone = function() {
      jeDropZone.style.display = "none";
    };

    var handleDrop = function(e) {
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
          return;
        }
        else if ('code,config,desc,schema,startval,style,title' !== Object.getOwnPropertyNames(JSON.parse(response)).sort().join(',')) {
          jeModalContent.innerText = 'JSON file is not in the correct format';
          toggleModal();
          return;
        }

        updateFromFile(response);
      };
      reader.readAsText(file);
    };

    var dragHandler = function(e) {
      switch ((this == window ? 'w_' : 'z_') + e.type) {
        case 'w_dragstart':
          this.disabled = true;
          break;
        case 'w_dragend':
          this.disabled = false;
          break;
        case 'w_dragenter':
          if (this.disabled !== true) showDropZone();
          break;
        case 'z_dragenter':
        case 'z_dragover':
          e.dataTransfer.dropEffect = 'copy';
          break;
        case 'z_dragleave':
          hideDropZone();
          break;
        case 'z_drop':
          handleDrop(e);
          break;
      }

      if (this.disabled !== true) e.preventDefault();

    };

    // Filter out duplicates from array
    var uniqueArray = function(arr) {
      var seen = {};
      return arr.filter(function(item) {
          return seen.hasOwnProperty(item) ? false : seen[item] = true;
      });
    };

    // Get CSS and JavaScript files listed in comments using special keywords
    var getUserIncludes = function(code, regex) {
      var match = regex.exec(code), res = [];
      while (match != null) {
        if (match[2].trim()) res.push(match[2]);
        match = regex.exec(code);
      }
      return res;
    };

     // Build list of external files to include in Iframe
    var buildExtFiles = function(options, code) {
      var jsFiles = [], cssFiles = [], extFiles = '', map, styles = aceStyleEditor.getValue().trim();

      for (var i in options) {
        if (options.hasOwnProperty(i) && (mapping.ext_lib[i] || mapping[i] && mapping[i][options[i]])) {
          map = mapping.ext_lib[i] || mapping[i][options[i]];
          if (map.js) jsFiles = jsFiles.concat(typeof map.js == 'string' ? [map.js] : map.js);
          if (map.css) cssFiles = cssFiles.concat(typeof map.css == 'string' ? [map.css] : map.css);
        }
      }

      // Include CSS and JavaScript files listed in comments using special keywords
      cssFiles = cssFiles.concat(getUserIncludes(code, /\s*\/\/\s*includeCSS\((['"])([^"']*)\1\)/g));
      jsFiles = jsFiles.concat(getUserIncludes(code, /\s*\/\/\s*includeJS\((['"])([^"']*)\1\)/g));

      cssFiles = uniqueArray(cssFiles);
      jsFiles = uniqueArray(jsFiles);

      if (cssFiles) extFiles += '<link rel="stylesheet" href="' + cssFiles.join('" /><link rel="stylesheet" href="') + '" />';
      if (jsFiles) extFiles += '<script src="' + jsFiles.join('"><\/script><script src="') + '"><\/script>';

      if (styles !== '') extFiles += '<style>' + styles +'</style>';

      return extFiles;
    };

    // Build list of JSON-Editor options from config options
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
              '<html lang="en"><head><title>JSON-Editor Form</title><meta http-equiv="content-type" content="text/html; charset=utf-8">' +
              '<style>body {margin:0;padding:0;font: normal .9em/1.2 Arial;background-color:#02577a !important;}' +
              '.inner-row {display: grid;background-color: #fff;position: relative;max-width: 1200px;left:50%;' +
              'transform: translate(-50%,0);padding: 1rem 2rem;box-shadow: 2px 0 5px rgba(0,0,0,.2);margin:0 0 3rem 0;}' +
              '</style><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/css/jsoneditor.min.css" /><script src="https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js"><\/script>' +
              buildExtFiles(options, code) +
              buildEditorOptions(options) +
              '</head><body>' +
              '<div class="inner-row"><div id="json-editor-form"></div></div><script>' +

              // Update JSON-Editor values from top window
              'window.updateSchemaValuesIframe = function(json) {' +
              ' if (jseditor instanceof window.JSONEditor && !jseditor.destroyed) {' +
              '  jseditor.setValue(json);' +
              ' }' +
              '};' +

              // Dummy upload function to prevent errors
              'var jseditor;window.JSONEditor.defaults.options.upload = function(type, file, cbs) {};' +
              'try{' +
              code +

              // Send form output and validation errors to top window
              'if (jseditor instanceof window.JSONEditor && !jseditor.destroyed) {' +
              '  jseditor.on("change",function() {' +
              '    window.top.iframeOutputCatcher(jseditor.getValue(), jseditor.validate());' +
              '  });' +
              '} else {' +
              '  window.top.iframeOutputCatcher(null, null, 1);' +
              '}' +

                // Send iframe errors to top window
               '}catch(err){if (window.top.iframeErrorCatcher) window.top.iframeErrorCatcher(err);else console.log(err);};' +
               '<\/script></body></html>';
    };

    // Update form values in iframe (Currently uses the StartVal editor, but should be from a different source)
    var setValueIframe = function() {
      var val = aceStartvalEditor.getValue();
      if (val.trim() && jeIframe.jseditor) jeIframe.jseditor.setValue(JSON.parse(val));
    };

    //  Parse JSON string and return JSON object. Empty object returned on error
    var parseJson = function(str) {
      var res;
      try {res = JSON.parse(str);}
      catch(e) {res = {};}
      return res;
    };

    var uploadExampleHandler = function(e) {
      e.preventDefault();
      var files = e.target.files || e.dataTransfer.files;
      if (files.length !== 0) {
        var file = files[0];

        var reader = new FileReader();
        reader.onload = function(e) {
          var response = e.target.result;
          var err = isInvalidJson(response);
          if (err) {
            jeModalContent.innerText = err;
            toggleModal();
            return;
          }
          else if ('code,config,desc,schema,startval,style,title' !== Object.getOwnPropertyNames(JSON.parse(response)).sort().join(',')) {
            jeModalContent.innerText = 'JSON file is not in the correct format';
            toggleModal();
            return;
          }

          updateFromFile(response);
        };
        reader.readAsText(file);
      }

    };

    // Save Schema, Start Value, JavaScript Styles and Config options in examples schema format
    var downloadExampleHandler = function() {
      var example = {
            "title": prompt('Enter a Title for the example'),
            "schema" : parseJson(aceSchemaEditor.getValue()),
            "startval": parseJson(aceStartvalEditor.getValue()),
            "config": getJsonEditorOptions(),
            "code": aceCodeEditor.getValue().trim(),
            "style": aceStyleEditor.getValue().trim(),
            "desc": "Add optional description here. (HTML format)"
          },
          filename = (example.title || 'example').toLowerCase().replace(/[\s<>:"\\|*]/g, "-") + '.json',
          blob = new Blob([JSON.stringify(example, null, 2)], {type: "application/json;charset=utf-8"});

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
          var a = document.createElement('a');
          a.download = filename;
          a.href = URL.createObjectURL(blob);
          a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
          eventClickFire(a);
      }

    };

    // Load external file
    var loadFile = function(file, mimeType, callback) {
      if (window.fetch && window.File && window.FileReader && window.FileList && window.Blob) {
        fetch(file, {mode: 'no-cors'})
        .then(function(response) {
          return response.blob();
        }).then(function(blob) {
          var reader = new FileReader();
          reader.onload = function(e) {
            callback(e.target.result);
          };
          reader.readAsText(blob);
        })
        .catch(function() {
           callback('');
        });
      }
      else {
        // IOS Safari and other crappy browsers :D
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType(mimeType);
        xobj.open('GET', file, true);
        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4) {
            if (xobj.status == '200') callback(xobj.responseText);
            else callback('');
          }
        };
        xobj.send(null);
      }
    };

    // Change event handler - Load selected JSON Schema into editor
    var loadExampleFiles = function() {
      var example = this.options[this.selectedIndex].value;
      if (example) {
        loadFile('examples/' + example + '.json', 'application/json', updateFromFile);
      }
    };

    // Extend expand/collapse for details/summary tags, so that only one open is allowed
    var summaryOpenHandler = function(e) {
      if (e.target.nodeName == 'SUMMARY') {
        var details = this.querySelectorAll('details');
        for (var i=0;i<details.length;i++) {
          if (details[i] != e.target.parentNode) details[i].removeAttribute('open');
        }
      }
    };

    // Handler for buttons in editor slidedown panel
    var editorPanelButtonHandler = function(e) {
      // "this" is the ACE Editor instance
      if (e.target.dataset.action) {
        e.preventDefault();
        switch (e.target.dataset.action.toLowerCase()) {
          case 'beautify':
            aceBeautify.beautify(this.session);
          break;
          case 'clear': {
            this.setValue('');
            this.session.getSelection().clearSelection();
            break;
          }
        }
      }
    };

    // Set click event action for buttons in editor slidedown menus
    var setEditorPanelButtons = function(edEl, ed) {
      var buttons = edEl.parentNode.querySelectorAll('.slidedown-menu button');
      [].forEach.call(buttons, function(button) {
        button.addEventListener('click', editorPanelButtonHandler.bind(ed));
      });
    };

    // "OnReady" event for Iframe
    var iframeOnReady = function(a, b) {
      return "loading" === a.readyState ? a.addEventListener("DOMContentLoaded", b) : b();
    };

    // Callback for when iframe is ready
    var iframeReady = function() {
      // console.log('Not busy');
      jeBusyOverlay.classList.remove('active');
      eventFire(document.querySelector('nav.tabs button:nth-of-type(1)'), 'click');
    };

    // Click event handler - Creates the form from the JSON schema
    var generateForm = function(e) {
      e.preventDefault();

      window.requestAnimationFrame(function() {
        // console.log('Busy');
        jeBusyOverlay.classList.add('active');
        iframeOnReady(jeIframe, iframeReady);
      });

      // Get content of ACE editor schema, startval and JavaScript;
      var code = getCode(aceSchemaEditor.getValue(), aceStartvalEditor.getValue()) + aceCodeEditor.getValue();

/*      jeIframe.document.open();
      jeIframe.document.write(createIframeContent(code)); // Iframe method
      jeIframe.document.close();*/

      // Alternative to write() which is deprecated
      var bData = new Blob([createIframeContent(code)], {type: 'text/html'});
      jeIframeEl.src = window.URL.createObjectURL(bData);
      window.URL.revokeObjectURL(bData);
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
    aceSchemaEditor.renderer.setOptions({
      minLines: 40,
      maxLines: 40
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
    aceStartvalEditor.renderer.setOptions({
      minLines: 40,
      maxLines: 40
    });

    // Setup ACE editor for editing output values
    aceOutputEditor = window.ace.edit(jeOutput);
    aceOutputEditor.setOptions({
      theme: aceTheme
    });
    aceOutputEditor.session.setOptions({
      mode: 'ace/mode/json',
      tabSize: 2,
      useSoftTabs: true
    });
    aceOutputEditor.renderer.setOptions({
      minLines: 40,
      maxLines: 40
    });

    // Setup ACE editor for displayiong validation results
    aceValidateEditor = window.ace.edit(jeValidate);
    aceValidateEditor.setOptions({
      readOnly: true,
      theme: aceTheme
    });
    aceValidateEditor.session.setOptions({
      mode: 'ace/mode/json',
      tabSize: 2,
      useSoftTabs: true
    });
    aceValidateEditor.renderer.setOptions({
      minLines: 40,
      maxLines: 40
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
    aceCodeEditor.renderer.setOptions({
      minLines: 40,
      maxLines: 40
    });

    // Setup ACE editor for editing CSS
    aceStyleEditor = window.ace.edit(jeEditCSS);
    aceStyleEditor.setOptions({
      theme: aceTheme
    });
    aceStyleEditor.session.setOptions({
      mode: 'ace/mode/css',
      tabSize: 2,
      wrap: true,
      useSoftTabs: true,
      useWrapMode: true,
      indentedSoftWrap: true
    });
    aceStyleEditor.renderer.setOptions({
      minLines: 40,
      maxLines: 40
    });

    // Show error if JSON schema or startval is invalid
    aceSchemaEditor.on("blur", showModalError.bind(aceSchemaEditor));
    aceStartvalEditor.on("blur", showModalError.bind(aceStartvalEditor));

    // Update form if output JSON is changed
    aceOutputEditor.on("blur", updateSchemaValues.bind(aceOutputEditor));

    // Set buttom event to restore initial value of ACE editor content.
    setEditorPanelButtons(jeEditSchema, aceSchemaEditor);
    setEditorPanelButtons(jeEditStartval,aceStartvalEditor);
    setEditorPanelButtons(jeEditCode, aceCodeEditor);
    setEditorPanelButtons(jeEditCSS, aceStyleEditor);

    // Set events on tabs buttons
    jeTabs.addEventListener('click', tabsHandler);

    // Set button event for loading external schemas
    if (window.fetch && window.File && window.FileReader && window.FileList && window.Blob) jeSchemaLoad.addEventListener('change', loadExampleFiles);
    else {
      jeSchemaLoad.disabled = true;
      jeSchemaLoad.style.cursor = 'not-allowed';
      jeSchemaLoad.title = 'Not available locally due to CORS policy';
    }

    // Set button event for generating form
    jeExec.addEventListener('click', generateForm);
    jeSetValue.addEventListener('click', setValueIframe);

    // Create the direct link URL
    jeDirectLink.addEventListener('click', updateDirectLink);
    jeUrlReset.addEventListener('click', resetUrl);

    // Set button event for downloading as example
    jeDownloadExample.addEventListener('click', downloadExampleHandler);
    // Set button event for uploading example
    jeUploadExample.addEventListener('click', eventClickFire.bind(null, jeFileUpload));
    jeFileUpload.addEventListener('change', uploadExampleHandler);

    // Set event handler for details/summary tags
    jeCfg.addEventListener('click', summaryOpenHandler);

    // Set Drag'n'Drop handlers
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      ['dragenter', 'dragstart', 'dragend'].forEach(function(ev) {
        window.addEventListener(ev,  dragHandler, false);
      });
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(ev) {
        jeDropZone.addEventListener(ev,  dragHandler, false);
      });
    }

    // Set movable split panels
    window.Split(jeSplitPanels[0], jeSplitCfg);
    window.Split(jeSplitPanels[1], jeSplitCfg);
    window.Split(jeSplitPanels[2], jeSplitCfg);

    // Update fields from query parameters
    updateFromUrl();

   // Create initial form
    var code = getCode(aceSchemaEditor.getValue(), aceStartvalEditor.getValue()) + aceCodeEditor.getValue();

/*    jeIframe.document.open();
    jeIframe.document.write(createIframeContent(code)); // Iframe method
    jeIframe.document.close();*/

    // Alternative to write() which is deprecated
    var bData = new Blob([createIframeContent(code)], {type: 'text/html'});
    jeIframeEl.src = window.URL.createObjectURL(bData);
    window.URL.revokeObjectURL(bData);

})();
