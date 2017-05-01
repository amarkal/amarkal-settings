$(document).ready(function(){
    $('.amarkal-settings-button').on('click',function(e){
        e.preventDefault();
        var $button = $(this);

        if(!$button.data('disabled'))
        {
            $('.amarkal-settings-button').data('disabled',true);
            $button.addClass('processing');

            Amarkal.settings[$button.val()](function(){
                $button.removeClass('processing');
                $('.amarkal-settings-button').data('disabled',false);
            });
        }
    });
}); 