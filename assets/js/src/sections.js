Amarkal.settings.sections = {
    $links: null,
    $loader: null,
    data: null,
    activeSection: null,
    init: function() {
        this.data = JSON.parse($('#sections-config').text());
        this.$links = $('.amarkal-settings-sections li');
        this.$loader = $('#amarkal-settings-loader');

        this.initSections();
    },
    initSections: function() {
        if(typeof this.data === 'object' && Object.keys(this.data).length > 0) {
            var _this = this;
            this.$links.on('click', function(){
                _this.activate($(this).attr('data-slug'));
            });
            this.activateInitialSection();
            this.$loader.hide();
        }
        else {
            Amarkal.settings.fields.showAll();
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
        if(this.activeSection === sectionSlug) {
            return;
        }
        this.activeSection = sectionSlug;

        this.$links
            .removeClass('active')
            .filter('[data-slug="'+sectionSlug+'"]')
            .addClass('active');

        Amarkal.settings.header.setSectionTitle(this.getTitle(sectionSlug));
        Amarkal.settings.header.setSectionSubtitle(this.getSubtitle(sectionSlug));
        Amarkal.settings.fields.showBySection(sectionSlug);

        window.location = '#'+sectionSlug;
    },
    deactivate: function() {
        var sectionSlug = this.activeSection;
        this.$links.removeClass('active');
        Amarkal.settings.fields.hideAll();
        this.activeSection = null;
    },
    flag: function(type, slug) {
        this.$links.filter('[data-slug="'+slug+'"]').addClass('flag-'+type);
    },
    unflagAll: function() {
        this.$links.removeClass('flag-error flag-notice');
    },
    getTitle: function(slug) {
        return this.data[slug].title;
    },
    getSubtitle: function(slug) {
        return this.data[slug].subtitle;
    }
};