$('.amarkal-settings-button').on('click',function(e){
    e.preventDefault();
    var $button = $(this);
    console.log(getFormData());
    if(!$button.data('disabled'))
    {
        $('.amarkal-settings-button').data('disabled',true);
        $button.addClass('processing');
        
        $.post(ajaxurl, {
            action: 'amarkal_settings_'+$button.val(),
            data: getFormData()
        }, function(res){
            console.log(res);
            $button.removeClass('processing');
            $('.amarkal-settings-button').data('disabled',false);
        });
    }
});