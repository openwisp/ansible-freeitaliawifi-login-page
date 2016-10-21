var getTranslation = function(key){
    if (i18n.current in i18n && key in i18n[i18n.current]) {
        return i18n[i18n.current][key];
    }
    return key;
},
translate = function(lang){
    if (lang) {
        i18n.current = lang;
    }
    $('.t').text(function(){
        return getTranslation($(this).attr('data-i18n'));
    });
    $('a.lang').removeClass('active');
    $('a.' + i18n.current).addClass('active')
};
// when DOM is ready
$(function($) {
    var fiw = $('#fiw'),
        defaultRealm = fiw.val(),
        username = $('#username'),
        loadingOverlay = $('#overlay-loading');
    /* JSONP callback */
    window.freeitaliawifiRealms = function(data) {
        fiw.html('');
        $.each(data, function(i, value){
            var html = '<option value="' + value[0] +'">' + value[1] + '</option>';
            fiw.append(html);
        });
        fiw.val(defaultRealm);
    };
    $.ajax({
        url: "{{ fiw_realm_json }}",
        jsonp: "freeitaliawifiRealms",
        dataType: "jsonp"
    });
    // submit logic
    $('#login form').submit(function(){
        // show loading overlay
        loadingOverlay.css('display', 'table');
        // add realm if not present
        var value = username.val(),
            currentRealm = fiw.val();
        if(value.indexOf('@') < 0 && currentRealm != defaultRealm){
            username.val(value + '@' + fiw.val());
        }
    });
    {% if fiw_news_rss %}
    $('#news').rss('{{ fiw_news_rss }}', {
        limit: 3,
        ssl: true,
        effect: 'show',
        dateFormat: 'D / M / YYYY',
        layoutTemplate: '{entries}',
        entryTemplate: '<p><a href="{url}" target="_blank">{title}</a><br/><span class="date">{date}</span></p>',
        host: '{{ fiw_feedr_host }}'
    });
    {% endif %}
    {% if fiw_service_rss %}
    $('#publicwifi').rss('{{ fiw_service_rss }}', {
        limit: 2,
        ssl: true,
        effect: 'show',
        dateFormat: 'D / M / YYYY',
        layoutTemplate: "{entries}",
        entryTemplate: '<p><a href="{url}" target="_blank">{title}</a><br/><span class="date">{date}</span></p>',
        host: '{{ fiw_feedr_host }}'
    });
    {% endif %}
    // fiw overlay
    var fiwOverlay = $('#overlay-fiw'),
        menu = $('#menu')
        body = $('body');
    $('#help-fiw').click(function(e){
        e.preventDefault();
        fiwOverlay.fadeIn(250);
        body.css('overflow', 'hidden');
    });
    $('.overlay .close').click(function(e){
        e.preventDefault();
        $(this).parent().fadeOut(250);
        body.attr('style', '');
    });
    $('#toggle-menu').click(function(e){
        e.preventDefault();
        body.css('overflow', 'hidden');
        menu.slideDown(250);
    });
    menu.click(function(e){
        menu.attr('style', '');
        body.attr('style', '');
    });
    // prepare translation attributes
    $('.t').each(function(i, el){
        var $el = $(el);
        $el.attr('data-i18n', $el.text());
    });
    translate();
    loadingOverlay.hide();
});
