// includeJS("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js")
// includeJS("https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/1.2.1/typeahead.bundle.min.js")
// includeCSS("https://pmk65.github.io/jedemov2/dist/examples/bloodhound.css")

// Initialize the Typeahead/Bloodhound engine
// (See Typeahead/Bloodhound documentation for more info)
var zipEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace("navn"),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: "https://dawa.aws.dk/postnumre/%QUERY",
    wildcard: "%QUERY",
    cache: true
  }
});
zipEngine.clearPrefetchCache();
zipEngine.clearRemoteCache();
zipEngine.initialize();

// When JSON-Editor is ready perform action on field(s)
jseditor.on('ready', function() {

  // Watch for changes in the "zip" field
  jseditor.watch('root.address.zip',function() {
    // Get value from "zip" field
    var zipValue = jseditor.getEditor('root.address.zip').getValue();
    // If zipvalue a 4 digit number?
    if (/\d{4}/.test(zipValue)) {
      // Do an AJAX lookup using Bloodhound engine
      zipEngine.search(zipValue, null, function(res) {
        if (res.length) {
          // Set the value of "city" field to the returned value
          jseditor.getEditor('root.address.city').setValue(res[2]);
        }
      });
    }
  });

});
