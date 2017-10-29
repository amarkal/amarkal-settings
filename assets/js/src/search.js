/**
 * The search class is used internally to search through the fields and find those
 * that match the user's query.
 */
Amarkal.settings.search = {
    $input: null,
    activeSection: null,
    init: function() {
        this.$input = $('#settings-search');
        this.$input.on('keyup',this.onKeyup.bind(this));
    },
    onKeyup: function(e) {
        var query = this.$input.val().toLowerCase().replace(/[^\w\d\s]/g,'');
            
        // The user's search query is longer than 0 characters
        if(query.length > 0) {
            
            var $matches = Amarkal.settings.fields.search(query);
            
            // Store a copy of the active section before it is deactivated
            if(null === this.activeSection) {
                this.activeSection = Amarkal.settings.sections.activeSection;
            }

            Amarkal.settings.sections.deactivate();
            Amarkal.settings.header.setSectionTitle('Field Search Results');
            Amarkal.settings.header.setSectionSubtitle('');
            Amarkal.settings.fields.hideAll();
            Amarkal.settings.fields.show($matches);

            // Textual user feedback
            $('#settings-search-results').addClass('visible').text($matches.length ? $matches.length+' settings found' : 'Nothing found');
        }

        // The user's search query is not longer than 0 character
        else {
            $('#settings-search-results').removeClass('visible').text('');
            Amarkal.settings.sections.activate(this.activeSection);
            this.activeSection = null;
        }
    }
};