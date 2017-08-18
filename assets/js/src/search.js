/**
 * The search class is used internally to search through the fields and find those
 * that match the user's query.
 */
Amarkal.settings.search = {
    $fields: null,
    $input: null,
    init: function() {
        this.$fields = $('.amarkal-settings-field');
        this.$input = $('#settings-search');
        this.$input.on('keyup',this.onKeyup.bind(this));
    },
    onKeyup: function(e) {
        var query = this.$input.val().toLowerCase(),
            activeSection = Amarkal.settings.sections.activeSection,
            $matches;
    
        // The user's search query is longer than 1 character
        if(query.length > 0) {
            
            $matches = this.find(query);
            
            Amarkal.settings.sections.deactivate();
            Amarkal.settings.header.setSectionTitle('Field Search Results');
            Amarkal.settings.header.setSectionSubtitle('');
            $matches.addClass('visible');

            // Textual user feedback
            $('#settings-search-results').addClass('visible').text($matches.length ? $matches.length+' settings found' : 'Nothing found');
        }

        // The user's search query is not longer than 1 character
        else {
            $('#settings-search-results').removeClass('visible').text('');
            Amarkal.settings.sections.activate(activeSection);
        }
    },
    find: function(query) {
        var matches  = [];
        
        this.$fields.each(function(){
            var $field = $(this),
                title  = $field.find('h3').text().toLowerCase(),
                help = $field.find('.help-content').text();
                description = $field.find('.description').text();

            // Check query against the field's title
            if(title.match(query) || description.match(query) || help.match(query)) {
                matches.push($field);
            }
        });

        // Convert the matches array to a jQuery
        return $(matches).map(function(){return this.toArray();});
    }
};