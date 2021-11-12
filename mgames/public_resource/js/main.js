$(function () {
    var swiper1 = new Swiper('.swiper-container-1', {
        observer: true,
        observeParents: true,
        loop: true,
        navigation: {
            nextEl: '.swiper-container-1 .next',
            prevEl: '.swiper-container-1 .prev',
        },
        pagination: {
            el: '.swiper-pagination-1',
            bulletClass: 'bullet',
            bulletActiveClass: 'active',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + ' span-' + (index + 1) + '"></span>';
            },
        },       
        autoplay: {
            disableOnInteraction: false,
        }
    });
    var swiper2 = new Swiper('.swiper-container-2', {
        observer: true,
        observeParents: true,
        loop: true,
        navigation: {
            nextEl: '.swiper-container-2 .next',
            prevEl: '.swiper-container-2 .prev',
        },
        pagination: {
            el: '.swiper-pagination-2',
            bulletClass: 'bullet',
            bulletActiveClass: 'active',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + ' span-' + (index + 1) + '"></span>';
            },
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            disableOnInteraction: false,
        }
    });
    function stretchAcount() {
        var stretch = 75;
        var width = 750;
        var winW = $(window).width();
        if (winW <= width) {
            stretch = winW / width * stretch;
        }
        return stretch;
    };
    var swiper3 = new Swiper('.swiper-container-3', {
        effect: 'coverflow',
        observer: true,
        observeParents: true,
        slidesPerView: 1.132,
        centeredSlides: true,
        loop: true,
        loopedSlides: 20,
        // loopAdditionalSlides: 5,
        loopPreventsSlide: true,
        coverflowEffect: {
            rotate: 15,
            stretch: stretchAcount(),
            depth: 100,
            modifier: 2,
            slideShadows: false
        },
        navigation: {
            nextEl: '.swiper-container-3 .next',
            prevEl: '.swiper-container-3 .prev',
        },
        pagination: {
            el: '.swiper-pagination-3',
            bulletClass: 'bullet',
            bulletActiveClass: 'active',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + ' span-' + (index + 1) + '"></span>';
            },
        },
        on: {
            resize: function () {
                this.params.coverflowEffect.stretch = stretchAcount()
            }
        },
        autoplay: {
            disableOnInteraction: false,
        }
    });
});
