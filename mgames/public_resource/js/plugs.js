/*选项卡*/
; (function ($) {
    $.fn.tab = function (opitons) {
        var defaults = {
            tabNum: '.tab-num li',
            tabCell: '.tab-con',
            tabCur: 0,
            trigger: 'mouseenter',
        };
        return this.each(function () {
            var a = $.extend({}, defaults, opitons);
            var b = $(this);
            var c = $(a.tabNum, b);
            var d = $(a.tabCell, b);
            var e = a.trigger;
            var i = a.tabCur;
            c.eq(i).addClass('on');
            d.hide().eq(i).show();
            c.on(e, function () {
                var _t = $(this);
                var i = _t.index();
                c.removeClass('on').eq(i).addClass('on');
                d.hide().eq(i).show();
            });
        });
    };
})(Zepto);

$(function () {
    $('.tab-box').tab();
});
