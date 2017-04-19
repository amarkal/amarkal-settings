(function(){
    var $fields = $('.amarkal-settings-field');
    
    $('#settings-search').on('keyup',function(e){
        var query    = $(this).val().toLowerCase(),
            matches  = [];
            
        if(query.length > 1) {
            $fields.hide().each(function(){
                var $field = $(this),
                    title  = $field.attr('data-title').toLowerCase();
                    
                if(title.match(query)){
                    matches.push($field);
                }
            });
            
            $(matches).map(function(){return this.toArray();}).show();
            
            $('#settings-search-results').text(matches.length ? matches.length+' settings found' : 'Nothing found');
        }
        else {
            $fields.show();
            $('#settings-search-results').text('');
        }
    });
})();