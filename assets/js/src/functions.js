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
        
        $('.amarkal-ui-component').amarkalUIComponent('reset');
        console.log(res.errors);
        if(!$.isEmptyObject(res.errors)) {
            var error = '', i = 0;
            for(var name in res.errors) {
                if(i > 0) error += '<br>';
                error += res.errors[name];
                $('[amarkal-component-name="'+name+'"]').amarkalUIComponent('makeInvalid');
                i++;
            }
            Amarkal.settings.notifier.error(error);
        }
        else {
            Amarkal.settings.notifier.success('Settings saved', 2000);
        }

        Amarkal.settings._updateValues(res.values, res.errors);
        
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
        
        $('.amarkal-ui-component').amarkalUIComponent('reset');
        
        Amarkal.settings.notifier.success('Default settings applied', 2000);
        Amarkal.settings._updateValues(res.values, res.errors);
        
        done();
    });
};

/**
 * Update all components in the current settings page with the given values.
 * 
 * @param {Object} values
 * @param {Array} errors
 */
Amarkal.settings._updateValues = function( values, errors )
{
    for(var name in values) {
        var value = values[name],
            $comp = $('[amarkal-component-name="'+name+'"]');
        
        if( typeof errors !== 'undefined' && 
            !errors.hasOwnProperty(name) && 
            $comp.hasClass('amarkal-ui-component')) {
        
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