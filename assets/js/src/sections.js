Amarkal.settings.sections = {
    $fields: null,
    $links: null,
    $loader: null,
    sections: null,
    activeSection: null,
    init: function() {
        this.sections = JSON.parse($('#sections-config').text());
        this.$fields = $('.amarkal-settings-field');
        this.$links = $('.amarkal-settings-sections li');
        this.$loader = $('#amarkal-settings-loader');

        this.initSections();
    },
    initSections: function() {
        if(typeof this.sections === 'object' && Object.keys(this.sections).length > 0) {
            var _this = this;
            this.$links.on('click', function(){
                _this.activate($(this).attr('data-slug'));
            });
            this.activateInitialSection();
            this.$loader.hide();
        }
        else {
            this.$fields.addClass('visible');
        }
    },
    activateInitialSection: function() {
        if('' !== window.location.hash) {
            this.activate(window.location.hash.substring(1));
        }
        else {
            this.activate($(this.$links[0]).attr('data-slug'));
        }
    },
    activate: function(sectionSlug) {
        this.$links.each(function(){
            $(this).removeClass('active');
            if($(this).attr('data-slug') === sectionSlug) {
                $(this).addClass('active');
            }
        });

        this.$fields.removeClass('visible');
        Amarkal.settings.header.setSectionTitle(this.getTitle(sectionSlug));
        Amarkal.settings.header.setSectionSubtitle(this.getSubtitle(sectionSlug));
        this.activeSection = sectionSlug;

        $('.amarkal-settings-field[data-section="'+sectionSlug+'"]')
            .addClass('visible')
            .find('.amarkal-ui-component')
            .amarkalUIComponent('refresh');

        window.location = '#'+sectionSlug;
    },
    deactivate: function() {
        var sectionSlug = this.activeSection;
        this.$links.removeClass('active');
        this.$fields.removeClass('visible');
    },
    flag: function(type, slug) {
        this.$links.filter('[data-slug="'+slug+'"]').addClass('flag-'+type);
    },
    unflagAll: function() {
        this.$links.removeClass('flag-error flag-notice');
    },
    getTitle: function(slug) {
        return this.sections[slug].title;
    },
    getSubtitle: function(slug) {
        return this.sections[slug].subtitle;
    }
};