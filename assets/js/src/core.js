var $ = window.jQuery;

exports.settings = {
    haveBeenModified: false,
    init: function() {
        
        Amarkal.settings.fields.init();
        Amarkal.settings.search.init();
        Amarkal.settings.sections.init();

        $('.amarkal-ui-component').on('amarkal.change',function(e, component){
            Amarkal.settings.notifier.notice("Settings have changed, click \"Save\" to apply them.");
            Amarkal.settings.sections.flag('notice', component.props.section);
            Amarkal.settings.fields.flag('notice', component.props.name);
            Amarkal.settings.haveBeenModified = true;
        }).on('amarkal.hide', function(){
            Amarkal.settings.fields.hide($(this).parents('.amarkal-settings-field'));
        }).on('amarkal.show', function(){
            if($(this).parents('.amarkal-settings-field').attr('data-section') === Amarkal.settings.sections.activeSection) {
                Amarkal.settings.fields.show($(this).parents('.amarkal-settings-field'));
            }
        });

        // This is called after the onChange/hide/show event listeners are added since some events
        // are triggered when the form is instantiated
        $('#amarkal-settings-form').amarkalUIForm();

        $(window).on('beforeunload',function(){
            if(Amarkal.settings.haveBeenModified) {
                return 'Are you sure you want to leave this page?';
            }
        });
    }
};

$(document).ready(function(){
    Amarkal.settings.init();
});
