Amarkal.settings.fields = {
    $fields: null,
    init: function () {
        this.$fields = $('.amarkal-settings-field');
    },
    hideAll: function () {
        this.hide(this.$fields);
    },
    showAll: function () {
        this.show(this.$fields);
    },
    showBySection: function (slug) {
        this.hideAll();
        this.show(this.$fields.filter('[data-section="'+slug+'"]'));
    },
    search: function(query) {
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

        // Convert the matches array to a jQuery object
        return $(matches).map(function(){return this.toArray();});
    },
    show: function($fields) {
        $fields
            .addClass('visible')
            .find('.amarkal-ui-component')
            .amarkalUIComponent('refresh');
    },
    hide: function($fields) {
        $fields.removeClass('visible');
    },
    flag: function(type, fieldName) {
        this.$fields.filter('[data-name="'+fieldName+'"]').addClass('flag-'+type);
    },
    unflagAll: function() {
        this.$fields.removeClass('flag-error flag-notice');
    }
};