var $ = window.jQuery;

exports.settings = {
    init: function() {
        
        Amarkal.settings.fields.init();
        Amarkal.settings.search.init();
        Amarkal.settings.sections.init();

        // This is called after the onChange/hide/show event listeners are added since some events
        // are triggered when the form is instantiated
        $('#amarkal-settings-form').amarkalUIForm();
    }
};

$(document).ready(function(){
    Amarkal.settings.init();
});
