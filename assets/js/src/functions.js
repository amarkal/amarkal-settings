/**
 * Asynchronously save all settings in the current settings page to the database.
 * Shows an error notification if errors occur. Shows a success notification
 * otherwise.
 * 
 * @param {Function} done
 */
Amarkal.settings.save = function( done ) 
{
    Amarkal.settings._postData('save',function(res){
        
        if(res.errors.length) {
            var error = '';
            for(var i = 0; i < res.errors.length; i++) {
                error += res.errors[i].message;console.log($('[amarkal-component-name="'+res.errors[i].name+'"]'));
                $('[amarkal-component-name="'+res.errors[i].name+'"]').amarkalUIComponent('makeInvalid');
            }
            Amarkal.settings.notifier.error(error);
        }
        else {
            Amarkal.settings.notifier.success('Settings saved', 2000);
        }

        Amarkal.settings._updateValues(res.values);
        
        done();
    });
};

/**
 * Asynchronously reset all settings in the current settings page to their 
 * default values and erase all data from the database. Shows a success 
 * notification upon completion.
 * 
 * @param {Function} done
 */
Amarkal.settings.reset = function( done ) 
{
    Amarkal.settings._postData('reset',function(res){
        
        Amarkal.settings.notifier.success('Default settings applied', 2000);
        Amarkal.settings._updateValues(res.values);
        
        done();
    });
};

/**
 * Update all components in the current settings page with the given values.
 * 
 * @param {Array} values
 */
Amarkal.settings._updateValues = function( values )
{
    for(var name in values) {
        var value = values[name],
            $comp = $('[amarkal-component-name="'+name+'"]');
        
        if($comp.hasClass('amarkal-ui-component')) {
            $comp.amarkalUIComponent('setValue', value);
        }
    }
};

/**
 * Send serialized form data to be processed in the backend by the function given
 * in the 'action' variable.
 * 
 * @param {string} action
 * @param {Function} done
 */
Amarkal.settings._postData = function( action, done )
{
    $.post(ajaxurl, {
        action: 'amarkal_settings_'+action,
        data: $('#amarkal-settings-form').serialize()
    }, done);
};