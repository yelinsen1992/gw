// 常用轮播操作
; (function ($) {
	"use strict";
	var Carousel = function (ele, options) {
		var defaults = {
			curIndex: 0,  // 当前索引
			autoPlay: true,
			interTime: 3000, // 间隔时间
			delayTime: 500,	// 持续时间
			trigger: 'mouseover',
			effect: 'fade', // fade为渐变轮播、leftLoop为左右无缝轮播、carousel为旋转木马、foshow为移动展开、 custom为五图自定义
			param: {
				vis: 3, // 可视个数最少3个，0则不限制
				rotate: 30,  // 3d旋转时Y轴的旋转角度
				stretch: 200, // 越大slide离得越远
				depeth: 500,  // 值越大z轴距离越远，看起来越小
				opacity: 0.6,   // 透明度
				modifier: 1,  // rotate、stretch、depth的倍率
			},
			foshow: {
				liHide: false,
				spanWidth: 140,
				imgWidth: 440,
				space: 10,
			},
			custom: [
				[0.6, '-6.46rem', '0px', '-5rem'],
				[0.4, '-5rem', '-1rem', '-17rem'],
				[0.6, '6.46rem', '0px', '-5rem'],
				[0.6, '5rem', '-1rem', '-17rem'],
			],
			afterSlide: function (index, num) {
			},
			leftLoopWidth: 850,
			unit: 'rem',	// 单位px/rem， rem则 1rem = 100px
		};
		this.opts = $.extend(true, defaults, options);
		this.ele = ele;
	};
	Carousel.prototype = {
		init: function () {	//初始化
			var t = this;
			t.initHtml();
			t[t.opts.effect](t.curIndex);
			t.bindFuc(t.opts.effect);
			return t;
		},
		fade: function (num) {
			var t = this;
			t.imgLi.css({
				position: 'absolute',
				left: 0,
				top: 0,
				width: '100%',
				height: '100%',
			});
			t.imgLi.eq(num).addClass('on').fadeIn(t.opts.delayTime).siblings().removeClass('on').fadeOut(t.opts.delayTime);
			t.numLi.removeClass('on').eq(num).addClass('on');
			t.opts.afterSlide(t.curIndex, t.number);
		},
		leftLoop: function (num) {
			var t = this;
			var x = t.opts.unit == 'rem' ? t.opts.leftLoopWidth / 100 : t.opts.leftLoopWidth;
			t.ele.find('.tempWrap').css({
				transform: 'translateX(-' + x * (num + 1) + t.opts.unit + ')',
				transition: 'all ' + t.opts.delayTime + 'ms ease-in-out',
			});
			if (num >= t.number) {
				var timer = setTimeout(function () {
					t.ele.find('.tempWrap').css({
						transform: 'translateX(-' + x + t.opts.unit + ')',
						transition: 'all 0s ease-in-out',
					});
					clearTimeout(timer);
				}, t.opts.delayTime);
				num = 0;
			} else if (num <= -1) {
				var timer = setTimeout(function () {
					t.ele.find('.tempWrap').css({
						transform: 'translateX(-' + x * (num + 1) + t.opts.unit + ')',
						transition: 'all 0s ease-in-out',
					});
					clearTimeout(timer);
				}, 500);
				num = t.number - 1;
			};
			t.imgLi.removeClass('on').eq(num).addClass('on');
			t.numLi.removeClass('on').eq(num).addClass('on');
			t.curIndex = num;
			t.opts.afterSlide(t.curIndex, t.number);
		},
		carousel: function (num) {
			var t = this;
			var hl = Math.floor(t.number / 2);
			var left, right;
			var x, d;
			var y = t.opts.param.rotate * t.opts.param.modifier;
			if (t.opts.unit == 'rem') {
				x = t.opts.param.stretch * t.opts.param.modifier / 100;
				d = t.opts.param.depeth * t.opts.param.modifier / 100;
			} else {
				x = t.opts.param.stretch * t.opts.param.modifier;
				d = t.opts.param.depeth * t.opts.param.modifier;
			};
			for (var i = 0; i < hl; i++) {
				left = num - i - 1;
				right = num + i + 1;
				if (right > t.number - 1) {
					right -= t.number;
				};
				var numI = i + 1;
				t.imgLi.eq(left).css({
					transform: 'translateX(-' + x * numI + t.opts.unit + ') translateZ(-' + d * numI + t.opts.unit + ') rotateY(' + y + 'deg)',
					opacity: t.opacity(i),
					transition: 'all ' + t.opts.delayTime + 'ms ease-in-out',
				});
				t.imgLi.eq(right).css({
					transform: 'translateX(' + x * numI + t.opts.unit + ') translateZ(-' + d * numI + t.opts.unit + ') rotateY(-' + y + 'deg)',
					opacity: t.opacity(i),
					transition: 'all ' + t.opts.delayTime + 'ms ease-in-out',
				});
				t.imgLi.removeClass('on');
				t.numLi.removeClass('on');
			};
			t.imgLi.eq(num).css({
				transform: 'translateX(0px) translateZ(0px) rotateY(0deg)',
				opacity: 1,
				transition: 'all ' + t.opts.delayTime + 'ms ease-in-out',
			}).addClass('on');
			t.numLi.eq(num).addClass('on');
			t.curIndex = num;
			t.opts.afterSlide(t.curIndex, t.number);
		},
		foshow: function (num) {
			var t = this;
			var w1, w2, k;
			var w1 = t.opts.foshow.spanWidth;
			var w2 = t.opts.foshow.imgWidth;
			if (t.opts.unit == 'rem') {
				w1 = t.opts.foshow.spanWidth / 100;
				w2 = t.opts.foshow.imgWidth / 100;
				k = t.opts.foshow.space / 100;
			} else {
				w1 = t.opts.foshow.spanWidth;
				w2 = t.opts.foshow.imgWidth;
				k = t.opts.foshow.space;
			};
			if (t.opts.foshow.liHide == false) {
				t.imgLi.css({ "margin-left": (k / 2) + t.opts.unit, "margin-right": (k / 2) + t.opts.unit }).stop().animate({ width: w1 + t.opts.unit }, 300).removeClass('on');
				t.imgLi.eq(num).stop().animate({ width: (w1 + w2 + k) + t.opts.unit }, 300).addClass('on').find('img').css({ "left": (w1 + k) + t.opts.unit });
				t.numLi.removeClass('on').eq(num).addClass('on');
			} else {
				t.imgLi.css({ "margin-left": (k / 2) + t.opts.unit, "margin-right": (k / 2) + t.opts.unit }).stop().animate({ width: w1 + t.opts.unit }, 300).removeClass('on');
				t.imgLi.find('span').stop().animate({ width: w1 + t.opts.unit }, 300);
				t.imgLi.eq(num).find('span').stop().animate({ width: 0 }, 300);
				t.imgLi.eq(num).stop().animate({ width: w2 + t.opts.unit }, 300).addClass('on');
				t.numLi.removeClass('on').eq(num).addClass('on');
			};
			t.curIndex = num;
			t.opts.afterSlide(t.curIndex, t.number);
		},
		custom: function (num) { // 固定五图自定义样式
			var t = this;
			var leftA = num - 1;
			var leftB = num - 2;
			var rightA = num > 3 ? 4 - num : num + 1;
			var rightB = num > 2 ? num - 3 : num + 2;
			var o = t.opts.custom;
			t.imgLi.eq(leftA).css({
				transform: 'translate3d(' + o[0][1] + ', ' + o[0][2] + ', ' + o[0][3] + ')',
				opacity: o[0][0]
			});
			t.imgLi.eq(leftB).css({
				transform: 'translate3d(' + o[1][1] + ', ' + o[1][2] + ', ' + o[1][3] + ')',
				opacity: o[1][0]
			});
			t.imgLi.eq(rightA).css({
				transform: 'translate3d(' + o[2][1] + ', ' + o[2][2] + ', ' + o[2][3] + ')',
				opacity: o[2][0]
			});
			t.imgLi.eq(rightB).css({
				transform: 'translate3d(' + o[3][1] + ', ' + o[3][2] + ', ' + o[3][3] + ')',
				opacity: o[3][0]
			});
			t.imgLi.removeClass('on').eq(num).addClass('on').css({
				transform: 'translate3d(0px, 0px, 0px)',
				opacity: 1,
			});
			t.numLi.removeClass('on').eq(num).addClass('on');
			t.curIndex = num;
		},
		bindFuc: function (type) { // 绑定操作
			var t = this;
			t.ele.find('.prev').click(function () {	// 上一个
				t.prev();
				t.playStop();
			});
			t.ele.find('.next').click(function () {	// 下一个
				t.next();
				t.playStop();
			});
			t.numLi.on(t.opts.trigger, function () {	// 分页点击
				var index = $(this).index();
				if (t.isSwitch() === false) return;
				t[t.opts.effect](index);
				t.playStop();
			});
			if (t.opts.autoPlay) {	// 自动轮播
				t.playStart();
				t.ele.on('mouseleave', function () {
					if (t.playing == false) {
						t.playStart();
					};
				});
			};
			if (type == 'foshow') {
				t.imgLi.hover(function () {
					if (t.isSwitch() === false) return;
					t.foshow($(this).index());
				});
			} else if (type == 'custom') {
				t.imgLi.click(function () {
					var index = $(this).index();
					if (t.isSwitch() === false) return;
					t[t.opts.effect](index);
					t.playStop();
				});
			} else {
				var start, move, end;
				if (t.browserRedirect() == 'pc') {
					start = 'mousedown';
					move = 'mousemove';
					end = 'mouseup';
				} else {
					start = 'touchstart';
					move = 'touchmove';
					end = 'touchend';
				};
				t.imgLi.on(start, function (e) {
					var x = e.clientX ? e.clientX : (e.originalEvent.targetTouches[0]).clientX;
					t.pageX = x;
					t.imgLi.on(move, function (e) {
						var x = e.clientX ? e.clientX : (e.originalEvent.targetTouches[0]).clientX;
						t.moveX = x - t.pageX;
						e.preventDefault();
						return false;
					});
					e.preventDefault();
					return false;
				});
				t.imgLi.on(end, function (e) {
					t.imgLi.off(move);
					if (t.moveX > 10) {
						t.prev();
						t.playStop();
					} else if (t.moveX < -10) {
						t.next();
						t.playStop();
					};
					t.moveX = 0;
					e.preventDefault();
					return false;
				});
			};
		},
		playStart: function () {	// 自动轮播开始
			var t = this;
			t.playing = true;
			t.timer = setInterval(() => {
				t.next();
			}, t.opts.interTime);
		},
		playStop: function () {	// 自动轮播停止
			var t = this;
			if (t.playing) {
				t.playing = false;
				clearInterval(t.timer);
				t.timer = null;
			};
		},
		opacity: function (i) {	// 分层透明度
			var t = this;
			var opacityNum;
			if ((i + 3 - t.opts.param.vis) > 0 && t.opts.param.vis >= 3) {
				opacityNum = 0;
			} else {
				opacityNum = t.opts.param.opacity - 0.1 * i > 0 ? t.opts.param.opacity - 0.1 * i : 0.1;
			}
			return opacityNum;
		},
		initHtml: function () {	// 生成结构
			var t = this;
			if (t.opts.effect == 'carousel') {
				var len = t.ele.find('.slide-img').children().length;
				if (len % 2 == 0) {	// 偶数补为奇数量
					t.ele.find('.slide-img').append(t.ele.find('.slide-img').children().eq(Math.floor(len / 2)).clone().addClass('clone'));
				};
			};
			if (t.opts.effect == 'foshow') {
				t.ele.find('.slide-img img').each(function (index) {
					$(this).before('<span class=span-' + (index + 1) + '></span>')
				});
			};
			t.imgLi = t.ele.find('.slide-img').children();
			t.number = t.imgLi.length;
			if (t.opts.effect == 'leftLoop') {
				t.ele.find('.slide-img').children().wrapAll('<div class="tempWrap"></div>');
				t.imgLi = t.ele.find('.slide-img .tempWrap').children();
				var w = t.opts.unit == 'rem' ? t.opts.leftLoopWidth * (t.imgLi.length + 2) / 100 + 'rem' : t.opts.leftLoopWidth * (t.imgLi.length + 2) + 'px';
				var firstClone = t.ele.find('.slide-img .tempWrap').children().eq(0).clone().addClass('clone');
				var lastClone = t.ele.find('.slide-img .tempWrap').children().eq(-1).clone().addClass('clone');
				t.ele.find('.slide-img .tempWrap').append(firstClone);
				t.ele.find('.slide-img .tempWrap').prepend(lastClone);
				t.ele.find('.slide-img .tempWrap').css({
					width: w,
				});
			};
			var numHtml = '<ul>';
			for (var i = 0; i < t.number; i++) {
				numHtml += '<li class="li-' + (i + 1) + '"></li>';
			};
			numHtml += '</ul>';
			t.ele.find('.slide-num').append(numHtml);
			t.numLi = t.ele.find('.slide-num ul').children();
			t.curIndex = t.opts.curIndex;
		},
		prev: function () {	// 上一个
			var t = this;
			if (t.isSwitch() === false) return;
			if (t.opts.effect == 'leftLoop') {
				t.curIndex--;
				t[t.opts.effect](t.curIndex);
			} else {
				t.curIndex--;
				if (t.curIndex < 0) {
					t.curIndex = t.number - 1;
				};
				t[t.opts.effect](t.curIndex);
			}
		},
		next: function () {	// 下一个
			var t = this;
			if (t.isSwitch() === false) return;
			if (t.opts.effect == 'leftLoop') {
				t.curIndex++;
				t[t.opts.effect](t.curIndex);
			} else {
				t.curIndex++;
				if (t.curIndex > t.number - 1) {
					t.curIndex = 0;
				};
				t[t.opts.effect](t.curIndex);
			};
		},
		browserRedirect() {	// 判断是PC/移动端
			var sUserAgent = navigator.userAgent.toLowerCase();
			var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
			var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			var bIsMidp = sUserAgent.match(/midp/i) == "midp";
			var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
			var bIsAndroid = sUserAgent.match(/android/i) == "android";
			var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
			var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
			return bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM ? 'mobile' : 'pc';
		},
		isSwitch: function () {	// 切换中不允许连续切换
			var t = this;
			if (t.switching) {
				return false;
			};
			t.switching = true;
			var timer = setTimeout(function () {
				t.switching = false;
				clearTimeout(timer);
			}, t.opts.delayTime);
		},
		constructor: Carousel
	};
	$.fn.slide = function (options) {
		var carousel = new Carousel(this, options);
		return carousel.init();
	};
})(jQuery);

/*滚屏动画and楼层跳转*/
; (function ($) {
	$.fn.floor = function (opitons) {
		var defaults = {
			floor: '.part',
			floorNav: '.floor-nav-box',
			toTop: '.toTop',
			curClass: 'active',
			firstHide: false,
		};
		return this.each(function () {
			var a = $.extend({}, defaults, opitons);
			var b = $(a.floor);
			var c = $(a.floorNav).find('li');
			var d = $(a.toTop);
			var e = a.curClass;
			b.eq(0).addClass(e);
			c.eq(0).addClass(e);
			$(window).scroll(function () {
				var h = $(window).height();
				t = $(window).scrollTop();
				if (t > 1000) {
					d.fadeIn(400);
				} else {
					d.fadeOut(400);
				};
				b.each(function () {
					var i = $(this),
						iT = i.offset().top,
						iT_2 = iT - 300;
					if (h + t - iT > h / 2) {
						c.removeClass(e).eq(i.index()).addClass(e);
					}
					if (h + t - iT_2 > h / 2) {
						b.eq(i.index()).addClass(e);
					}
					if (t < 50) {
						b.eq(0).addClass(e);
						c.removeClass(e).eq(0).addClass(e);
					}
				})
			});
			c.click(function () {
				var i = $(this);
				t = b.eq(i.index()).offset().top;
				$('body,html').animate({ "scrollTop": t }, 500);
			});
			d.click(function () {
				$('body,html').animate({ "scrollTop": 0 }, 500);
			});
		});
	};
})(jQuery);

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
})(jQuery);


















