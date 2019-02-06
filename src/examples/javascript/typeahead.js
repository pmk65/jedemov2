// includeJS("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js")
// includeJS("https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/1.2.1/typeahead.bundle.min.js")
// includeCSS("https://raw.githubusercontent.com/bassjobsen/typeahead.js-bootstrap-css/master/typeaheadjs.css")

// Initialize the Typeahead/Bloodhound engine
// (See Typeahead/Bloodhound documentation for more info)
var roadEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace("tekst"),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: "https://dawa.aws.dk/vejnavne/autocomplete?q=%QUERY",
    wildcard: "%QUERY",
    cache: true
  }
});
roadEngine.clearRemoteCache();
roadEngine.initialize();

// Typeahead/Bloodhound dataset
var roadEngineDataset = {
  name: "road",
  display: "tekst",
  source: roadEngine.ttAdapter()
};
// Typeahead/Bloodhound config options
var roadEngineConfig = {
  autoselect: true,
  highlight: true,
  hint: true,
  minLength: 3
};

// When JSON-Editor is ready perform action on field(s)
jsoneditor.on('ready', function() {
  // Get the JSON-Editor for the "roadname" field
  var ed = jsoneditor.getEditor('root.roadname');

  if (ed) {
    // Attach the Typeahead/Bloodhound engine to the JSON-Editor input field
    $(ed.input).typeahead(roadEngineConfig, roadEngineDataset)
    .on("typeahead:asyncrequest", function() {
      // Enable spinner
      $(ed.input).parent().addClass("input-loading");
    })
    .on("typeahead:asynccancel typeahead:asyncreceive", function() {
      // Disable spinner
      $(ed.input).parent().removeClass("input-loading");
    });

    // Change parent (wrapper) display from inline-block to block
    $(ed.input).parent().css("display", "block");
  }
});
