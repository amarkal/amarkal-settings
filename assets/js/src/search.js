(function(){
    var $fields = $('.amarkal-settings-field');
    
    $('#settings-search').on('keyup',function(e){
        var query    = $(this).val().toLowerCase(),
            matches  = [];
        
        // The user's search query is longer than 1 character
        if(query.length > 1) {
            $fields.hide().each(function(){
                var $field = $(this),
                    title  = $field.attr('data-title').toLowerCase();
                
                // Check query against the field's title
                if(title.match(query)){
                    matches.push($field);
                }
            });
            
            // Show matches
            $(matches).map(function(){return this.toArray();}).show();
            
            // Textual user feedback
            $('#settings-search-results').text(matches.length ? matches.length+' settings found' : 'Nothing found');
        }
        
        // The user's search query is not longer than 1 character
        else {
            $fields.show();
            $('#settings-search-results').text('');
        }
    });
})();