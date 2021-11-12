
$(function () {
    var len = $('.part-box .part').length;
    $('.part-box').addClass('swiper-container').append('<div class="part part-'+ len +' part-auto"></div>').append('<div class="swiper-pagination active"></div>');
    $('.part-'+len).append($('.foot'));
    $('.m-bg').prepend($('.scan-box'));
    $('.banner').prepend($('.top-box'));
    $('.part').wrapAll('<div class="swiper-wrapper"></div>').addClass('swiper-slide');
    var mySwiper_1 = new Swiper('.part-box', {
        slideActiveClass: 'active',
        initialSlide: 0,
        autoplay:false,
        observer:true,
        observeParents:true,
        direction: 'vertical',
        slidesPerView :'auto',
        mousewheel: true,
        pagination: {
            el: '.swiper-pagination',
            bulletClass: 'bullte',
            bulletActiveClass: 'active',
            clickable: true,
            renderBullet: function (index, className) {
            return '<span class="' + className + ' span-'+ (index + 1) +'"><i></i></span>';
            },            
        },
        on: {
            transitionStart: function() {
                var el = this.$el.find('.swiper-pagination');
                this.activeIndex == 0 ? el.addClass('active') : el.removeClass('active')
            },
        }
    });
    $('.part-box .swiper-pagination').on('click', '.span-5', function() {
        mySwiper_1.slideTo(0, 500, false);
        return false;
    });
    /* 新闻选项卡 */
    $('.news-box').tab();
    /* 轮播 */
    $('.slide-box-1').slide();
    /* 游戏角色 */
    $('.slide-box-2').slide();
    /* 游戏特色 */
    $('.slide-box-3').slide({
        effect: 'carousel',
        param: {
            opacity:0.5,
            rotate: 40,
            stretch: 420,
            depeth: 500,
        }
    });
})