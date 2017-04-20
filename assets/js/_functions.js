function getFormData()
{
    var data = [];
    $('#amarkal-settings-form [name]').each(function(){
        data[$(this).attr('name')] = $(this).val();
    });
    return data;
}