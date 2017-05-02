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
        $('.amarkal-ui-component').on('amarkal.change',function(){
            Amarkal.settings.notifier.notice("Settings have changed, click \"Save\" to apply them.");
        });
    }
};

$(document).ready(function(){
    Amarkal.settings.init();
});
