var Amarkal;
if(typeof global.Amarkal === "undefined") {
    Amarkal = {};
    global.Amarkal = Amarkal;
}
else {
    Amarkal = global.Amarkal;
}

Amarkal.settings = {
    init: function() {
        $('.amarkal-ui-component').on('amarkal.change',function(e, component){
            Amarkal.settings.notifier.notice("Settings have changed, click \"Save\" to apply them.");
            Amarkal.settings.sections.flag('notice', component.props.section);
        });
        Amarkal.settings.search.init();
        Amarkal.settings.sections.init();
    }
};

$(document).ready(function(){
    Amarkal.settings.init();
});
