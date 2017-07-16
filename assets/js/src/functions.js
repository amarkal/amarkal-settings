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
        
        Amarkal.settings._clearErrors();
        
        if(!$.isEmptyObject(res.errors)) {
            for(var name in res.errors) {
                var $comp = $('[amarkal-component-name="'+name+'"]');
                
                $comp.amarkalUIComponent('makeInvalid');
                $comp.parent()
                     .children('.amarkal-settings-error')
                     .addClass('amarkal-visible')
                     .html(res.errors[name]);
            }
            Amarkal.settings.notifier.error('Some errors have occured, see below for more information.');
        }
        else {
            Amarkal.settings.notifier.success('Settings saved', 2000);
        }

        $('#amarkal-settings-form').amarkalUIForm('setData', res.values, res.errors);
        
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
        
        Amarkal.settings._clearErrors();
        Amarkal.settings.notifier.success('Default settings applied', 2000);
        $('#amarkal-settings-form').amarkalUIForm('setData', res.values, res.errors);
        
        done();
    });
};

Amarkal.settings._clearErrors = function()
{
    // Reset all components
    $('.amarkal-ui-component').amarkalUIComponent('reset');
    $('.amarkal-settings-error').removeClass('amarkal-visible').html('');
};

/**
 * Update all components in the current settings page with the given values.
 * 
 * @param {Object} values
 * @param {Array} errors
 */

/**
 * Send serialized form data to be processed in the backend by the function given
 * in the 'action' variable.
 * 
 * @param {string} action
 * @param {Function} done
 */
Amarkal.settings._postData = function( action, done )
{
    var data = $('#amarkal-settings-form').amarkalUIForm('getData');
    $('#amarkal-settings-form').find('input[name^="_amarkal"]').each(function(){
        data[$(this).attr('name')] = $(this).val();
    });

    $.post(ajaxurl, {
        action: 'amarkal_settings_'+action,
        data: data
    }, done);
};