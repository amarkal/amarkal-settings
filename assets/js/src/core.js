var Amarkal;
if(typeof global.Amarkal === "undefined") {
    Amarkal = {};
    global.Amarkal = Amarkal;
}
else {
    Amarkal = global.Amarkal;
}

Amarkal.settings = {
    haveBeenModified: false,
    init: function() {
        $('.amarkal-ui-component').on('amarkal.change',function(e, component){
            Amarkal.settings.notifier.notice("Settings have changed, click \"Save\" to apply them.");
            Amarkal.settings.sections.flag('notice', component.props.section);
            Amarkal.settings.fields.flag('notice', component.props.name);
            Amarkal.settings.haveBeenModified = true;
        });
        $(window).on('beforeunload',function(){
            if(Amarkal.settings.haveBeenModified) {
                return 'Are you sure you want to leave this page?';
            }
        });
        Amarkal.settings.fields.init();
        Amarkal.settings.search.init();
        Amarkal.settings.sections.init();
    }
};

$(document).ready(function(){
    Amarkal.settings.init();
});
