Amarkal.settings.fields = {
    $form: null,
    $fields: null,
    init: function () {
        this.$form = $('#amarkal-settings-form');
        this.$fields = this.$form.find('.amarkal-settings-field');

        var _this = this;
        $('.amarkal-ui-component').on('amarkal.change',function(e, component){
            if($(this).amarkalUIComponent('changed')) {
                Amarkal.settings.fields.flag('notice', component.props.name);
                Amarkal.settings.sections.flag('notice', component.props.section);
                Amarkal.settings.notifier.notice("Settings have changed, click \"Save\" to apply them.");
            }
            else {
                Amarkal.settings.fields.unflag('notice', component.props.name);
            }
            
            if(!Amarkal.settings.sections.changed(component.props.section)) {
                Amarkal.settings.sections.unflag('notice', component.props.section);
            }

            if(!_this.$form.amarkalUIForm('changed')) {
                Amarkal.settings.notifier.clearNotifications();
            }
        }).on('amarkal.hide', function(){
            Amarkal.settings.fields.hide($(this).parents('.amarkal-settings-field'));
        }).on('amarkal.show', function(){
            if($(this).parents('.amarkal-settings-field').attr('data-section') === Amarkal.settings.sections.activeSection) {
                Amarkal.settings.fields.show($(this).parents('.amarkal-settings-field'));
            }
        });
    },
    search: function(query) {
        var matches  = [];
        var $form    = this.$form;
        
        this.$fields.each(function(){
            var $field = $(this),
                name   =  $field.attr('data-name'),
                title  = $field.find('h3').text().toLowerCase(),
                help   = $field.find('.help-content').text();
                description = $field.find('.description').text();

            // Don't add fields that are currently hidden
            if('' !== name && !$form.amarkalUIForm('isVisible', name)) return;

            // Check query against the field's title
            if(title.match(query) || description.match(query) || help.match(query)) {
                matches.push($field);
            }
        });

        // Convert the matches array to a jQuery object
        return $(matches).map(function(){return this.toArray();});
    },
    show: function($fields) {
        var _this = this;
        $fields.each(function(){
            var $comp = $(this).find('.amarkal-ui-component'),
                name  = $comp.amarkalUIComponent('getName');

            // Only show components whose visibility condition is satisfied
            if(!name || _this.$form.amarkalUIForm('isVisible', name)) {
                $(this).addClass('visible');
                $comp.amarkalUIComponent('refresh');
            }
        });
    },
    hide: function($fields) {
        $fields.removeClass('visible');
    },
    hideAll: function () {
        this.hide(this.$fields);
    },
    showAll: function () {
        this.show(this.$fields);
    },
    flag: function(type, fieldName) {
        this.$fields.filter('[data-name="'+fieldName+'"]').addClass('flag-'+type);
    },
    unflag: function(type, fieldName) {
        this.$fields.filter('[data-name="'+fieldName+'"]').removeClass('flag-'+type);
    },
    unflagAll: function() {
        this.$fields.removeClass('flag-error flag-notice');
    }
};