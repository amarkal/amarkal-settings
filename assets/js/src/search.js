/**
 * The search class is used internally to search through the fields and find those
 * that match the user's query.
 */
Amarkal.settings.search = {
    $fields: null,
    $input: null,
    init: function() {
        var _this = this;
        this.$fields = $('.amarkal-settings-field');
        this.$input = $('#settings-search');
        this.$input.on('keyup',function(){_this.onKeyup();});
    },
    onKeyup: function(e) {
        var query = this.$input.val().toLowerCase(),
            $matches;
    
        // The user's search query is longer than 1 character
        if(query.length > 1) {
            
            $matches = this.find(query);
            
            this.$fields.hide();
            $matches.show();

            // Textual user feedback
            $('#settings-search-results').text($matches.length ? $matches.length+' settings found' : 'Nothing found');
        }

        // The user's search query is not longer than 1 character
        else {
            this.$fields.show();
            $('#settings-search-results').text('');
        }
    },
    find: function(query) {
        var matches  = [];
        
        this.$fields.each(function(){
            var $field = $(this),
                title  = $field.attr('data-title').toLowerCase(),
                description = $field.find('.description').text();

            // Check query against the field's title
            if(title.match(query) || description.match(query)){
                matches.push($field);
            }
        });

        // Convert the matches array to a jQuery
        return $(matches).map(function(){return this.toArray();});
    }
};