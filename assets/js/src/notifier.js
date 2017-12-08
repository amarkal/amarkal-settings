/**
 * The settings notifier class is used to display notifications in admin settings
 * pages. 
 */
Amarkal.settings.notifier = {
    classes: ['error','success','notice','info'],
    prefix: 'amarkal-',
    timeout: null,
    $el: null,
    notify: function(type, message, delay) {
        
        clearTimeout(Amarkal.settings.notifier.timeout);
        
        Amarkal.settings.notifier.$el
            .removeAttr('class')
            .addClass(Amarkal.settings.notifier.prefix+type)
            .html('<p>'+message+'</p>');
        
        if(typeof delay !== "undefined") {
            Amarkal.settings.notifier.timeout = setTimeout(function(){
                Amarkal.settings.notifier.clearNotifications();
            },delay);
        }
    },
    error: function(message, delay) {
        Amarkal.settings.notifier.notify('error', message, delay);
    },
    success: function(message, delay) {
        Amarkal.settings.notifier.notify('success', message, delay);
    },
    notice: function(message, delay) {
        Amarkal.settings.notifier.notify('notice', message, delay);
    },
    info: function(message, delay) {
        Amarkal.settings.notifier.notify('info', message, delay);
    },
    clearNotifications: function() {
        clearTimeout(this.timeout);
        this.$el.removeAttr('class').html('');
    },
    init: function() {
        this.$el = $('#amarkal-settings-notices');
    }
};

$(document).ready(function(){
    Amarkal.settings.notifier.init();
});