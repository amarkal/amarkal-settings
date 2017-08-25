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
        
        Amarkal.settings._clearNotices();
        
        if(!$.isEmptyObject(res.errors)) {
            for(var name in res.errors) {
                var $comp = $('[amarkal-component-name="'+name+'"]'),
                    instance = $comp.amarkalUIComponent('instance');
                
                $comp.amarkalUIComponent('makeInvalid');
                $comp.parent()
                     .children('.amarkal-settings-error')
                     .addClass('amarkal-visible')
                     .html(res.errors[name]);
            }
            Amarkal.settings.notifier.error('Some errors have occured, see below for more information.');
            Amarkal.settings.sections.flag('error', instance.props.section);
        }
        else {
            Amarkal.settings.notifier.success('Settings saved', 3000);
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
Amarkal.settings.resetAll = function( done ) 
{
    Amarkal.settings._postData('reset_all',function(res){
        
        Amarkal.settings._clearNotices();
        Amarkal.settings.notifier.success('Default settings applied', 3000);
        $('#amarkal-settings-form').amarkalUIForm('setData', res.values, res.errors);
        
        done();
    });
};

/**
 * Asynchronously reset all settings in the current settings section to their 
 * default values and erase all section data from the database. Shows a success 
 * notification upon completion.
 * 
 * @param {Function} done
 */
Amarkal.settings.resetSection = function( done ) 
{
    Amarkal.settings._postData('reset_section',function(res){
        
        Amarkal.settings._clearNotices();
        Amarkal.settings.notifier.success('Default settings applied for the section <strong>'+Amarkal.settings.sections.getTitle(Amarkal.settings.sections.activeSection)+'</strong>', 3000);
        $('#amarkal-settings-form').amarkalUIForm('setData', res.values, res.errors);
        
        done();
    });
};

/**
 * Reset all components and clear errors
 */
Amarkal.settings._clearNotices = function()
{
    // Reset all components
    $('.amarkal-ui-component').amarkalUIComponent('reset');
    $('.amarkal-settings-error').removeClass('amarkal-visible').html('');
    Amarkal.settings.sections.unflagAll();
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
    var data = $('#amarkal-settings-form').amarkalUIForm('getData');
    $('#amarkal-settings-form').find('input[name^="_amarkal"]').each(function(){
        data[$(this).attr('name')] = $(this).val();
    });

    // Set the active section (if applicable)
    data['_amarkal_settings_section'] = Amarkal.settings.sections.activeSection;

    $.post(ajaxurl, {
        action: 'amarkal_settings_'+action,
        data: data
    }, done);
};