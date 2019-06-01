var $ = require('jquery');

$(function () {
    $('.navigation__show-button').on('click', function () {
        var submenu = $('.submenu_open');
        if (submenu.length)
            submenu.removeClass('submenu_open');
        else
            $('.site-wrapper').toggleClass('site-wrapper_open');
    });

    $('.navigation').on('click', '.navigation__item', function(e) {
        var submenu = $(e.target).closest('.navigation__item').find('.submenu');

        if (!submenu.length) return;

        submenu.addClass('submenu_open');
    })
});