const express = require('express')
const path = require('path')
const app = express()
const pyfl = require('pyfl').default // 中文拼音获取首字母模块
const bodyParser = require('body-parser') // 请求解析模块
const debug = require('debug')('my-application') // debug模块
const ejs = require('ejs')
const fs = require('fs')

const {
  renderFuc,
  copyFuc
} = require('./fuc.js')
const gameDir = path.join(path.parse(__dirname).dir, 'games') // 生成的PC端官网存放目录
const mgameDir = path.join(path.parse(__dirname).dir, 'mgames') // 生成的移动端官网存放目录

app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  extended: false
})) // 解析post请求数据

app.use('/games', express.static(gameDir)) // PC端独立官网存放目录
app.use('/mgames', express.static(mgameDir)) // 移动端独立官网存放目录
app.use('/public', express.static(path.join(__dirname, 'public'))) // 允许目录文件可以访问
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico'))) // 设置图标

app.set('views', path.join(__dirname, 'views')) // 把views目录设置为模板文件的根，html文件模板放在view目录中
app.set('view engine', 'ejs') // 设置模板引擎为ejs
app.engine('html', ejs.renderFile) // 为html扩展名注册ejs

app.get('/', (req, res) => {
  res.render('pc_index.html')
})
app.get('/pc', (req, res) => {
  res.render('pc_index.html')
})
app.get('/mobile', (req, res) => {
  res.render('mobile_index.html')
})

// PC端创建调用插件js
const buildMainjs = async (obj, dir) => {
  return new Promise((resolve, reject) => {
    let text = '$(function(){\r\n'
    if (obj.fullScreen) { // 整屏切换
      text += '  var len = $(".part-box .part").length;\r\n' +
        '  $(".part-box").addClass("swiper-container").append("<div class=\'part part-auto part-"+ len +"\'></div>").append("<div class=\'swiper-pagination active\'></div>")\r\n' +
        '  $(".part-"+len).append($(".foot"));\r\n' +
        '  $(".m-bg").prepend($(".scan-box"));\r\n' +
        '  $(".banner").prepend($(".top-box"));\r\n' +
        '  $(".part").wrapAll("<div class=\'swiper-wrapper\'></div>").addClass("swiper-slide");\r\n' +
        '  var mySwiper_1 = new Swiper(".part-box", {\r\n' +
        '    slideActiveClass: "active",\r\n' +
        '    initialSlide: 0,\r\n' +
        '    autoplay: false,\r\n' +
        '    observer: true,\r\n' +
        '    observeParents: true,\r\n' +
        '    direction: "vertical",\r\n' +
        '    slidesPerView :"auto",\r\n' +
        '    mousewheel: true,\r\n' +
        '    pagination: {\r\n' +
        '      el: ".swiper-pagination",\r\n' +
        '      bulletClass: "bullte",\r\n' +
        '      bulletActiveClass: "active",\r\n' +
        '      clickable: true,\r\n' +
        '      renderBullet: function(index, className) {\r\n' +
        '        return "<span class=\'" + className + " span-" + (index + 1) +"\'><i></i></span>";\r\n' +
        '      }\r\n' +
        '    },\r\n' +
        '    on: {\r\n' +
        '      transitionStart: function() {\r\n' +
        '        var el = this.$el.find(".swiper-pagination");\r\n' +
        '        this.activeIndex == 0 ? el.addClass("active") : el.removeClass("active");\r\n' +
        '      },\r\n' +
        '    }\r\n' +
        '  });\r\n' +
        '  $(".part-box .swiper-pagination").on("click", ".span-5", function() {\r\n' +
        '    mySwiper_1.slideTo(0, 500, false);\r\n' +
        '    return false;\r\n' +
        '  });\r\n'
    } else { // 非整屏切换
      text += '  $(".part-box").floor();\r\n'
    }
    text += '  $(".news-box").tab();\r\n  $(".slide-box-1").slide();\r\n'
    // 自选动效模块
    for (let i = 0; i < obj.list.length; i++) {
      switch (obj.list[i].type) {
        case 1:
          text += '  $(".slide-box-' + (i + 2) + '").slide();\r\n'
          break
        case 2:
          text += '  $(".slide-box-' + (i + 2) + '").slide({\r\n    effect: "leftLoop"\r\n  });\r\n'
          break
        case 3:
          text += '  $(".slide-box-' + (i + 2) + '").slide({\r\n    effect: "carousel",\r\n    param: { stretch: 240, depeth: 600, opacity: 0.5 }\r\n  });\r\n'
          break
        case 4:
          text += '  $(".slide-box-' + (i + 2) + '").slide({\r\n    effect: "carousel",\r\n    param: { vis: 0, stretch: 240, depeth: 600, opacity: 0.5 }\r\n  });\r\n'
          break
        case 5:
          text += '  $(".slide-box-' + (i + 2) + '").slide({\r\n    effect: "foshow",\r\n    foshow: { liHide: false, spanWidth: 140, imgWidth: 440, space: 10 }\r\n  });\r\n'
          break
      }
    }
    if (obj.video) { // 是否有可播放视频
      text += '  var video = $(".popup-video").find("video")[0];\r\n' +
        '    $(".banner .video-play").click(function () {\r\n' +
        '      $(".popup-video").show();\r\n' +
        '      video.play();\r\n' +
        '    });\r\n' +
        '    $(".popup-video .close").click(function () {\r\n' +
        '      $(".popup-video").hide();\r\n' +
        '      video.pause();\r\n' +
        '    });\r\n'
    }
    text += '});'
    fs.writeFile(dir, text, (err) => {
      if (err) {
        console.log('出错了')
        reject(err)
      } else {
        console.log('main.js写入成功')
        resolve(true)
      }
    })
  })
}

// 移动端端创建调用插件js
const mbuildMainjs = async (obj, dir) => {
  return new Promise((resolve, reject) => {
    let text = '$(function(){\r\n' +
      '  var swiper1 = new Swiper(".swiper-container-1", {\r\n' +
      '    observer: true,\r\n    observeParents: true,\r\n    loop: true,\r\n' +
      '    navigation: {\r\n' +
      '      nextEl: ".swiper-container-1 .next",\r\n' +
      '      prevEl: ".swiper-container-1 .prev"\r\n' +
      '    },\r\n' +
      '    pagination: {\r\n' +
      '      el: ".swiper-pagination-1",\r\n' +
      '      bulletClass: "bullet",\r\n' +
      '      bulletActiveClass: "active",\r\n' +
      '      clickable: true,\r\n' +
      '      renderBullet: function(index, className) {\r\n' +
      '        return "<span class=\'" + className + " span-" + (index + 1) +"\'><i></i></span>";\r\n' +
      '      },\r\n' +
      '    },\r\n' +
      '    autoplay: {\r\n' +
      '      disableOnInteraction: false,\r\n' +
      '    },\r\n' +
      '  })\r\n'
    let flag = false
    for (let i = 0; i < obj.list.length; i++) {
      if ((obj.list[i].type === 3 || obj.list[i].type === 4) && flag === false) {
        text += '  function stretchAcount() {\r\n' +
        '    var stretch = 75;\r\n' +
        '    var width = 750;\r\n' +
        '    var winW = $(window).width();\r\n' +
        '    if (winW <= width) {\r\n' +
        '      stretch = winW / width * stretch;\r\n' +
        '    }\r\n' +
        '    return stretch;\r\n' +
        '  };\r\n'
        flag = true
      }
      text += '  var swiper' + (i + 2) + ' = new Swiper(".swiper-container-' + (i + 2) + '", {\r\n' +
        '    observer: true,\r\n    observeParents: true,\r\n    loop: true,\r\n' +
        '    navigation: {\r\n' +
        '      nextEl: ".swiper-container-' + (i + 2) + ' .next",\r\n' +
        '      prevEl: ".swiper-container-' + (i + 2) + ' .prev"\r\n' +
        '    },\r\n' +
        '    pagination: {\r\n' +
        '      el: ".swiper-pagination-' + (i + 2) + '",\r\n' +
        '      bulletClass: "bullet",\r\n' +
        '      bulletActiveClass: "active",\r\n' +
        '      clickable: true,\r\n' +
        '      renderBullet: function(index, className) {\r\n' +
        '        return "<span class=\'" + className + " span-" + (index + 1) +"\'><i></i></span>";\r\n' +
        '      },\r\n' +
        '    },\r\n' +
        '    autoplay: {\r\n' +
        '      disableOnInteraction: false,\r\n' +
        '    },\r\n'
      if (obj.list[i].type === 1) {
        text += '    effect: "fade",\r\n' +
        '    fadeEffect: {\r\n' +
        '      crossFade: true\r\n' +
        '    },\r\n'
      } else if (obj.list[i].type === 3 || obj.list[i].type === 4) {
        text += '    effect: "coverflow",\r\n' +
        '      slidesPerView: 1.132,\r\n' +
        '      centeredSlides: true,\r\n' +
        '      loopedSlides: 20,\r\n' +
        '      loopPreventsSlide: true,\r\n' +
        '      coverflowEffect: {\r\n' +
        '        rotate: 15,\r\n' +
        '        stretch: stretchAcount(),\r\n' +
        '        depth: 100,\r\n' +
        '        modifier: 2,\r\n' +
        '        slideShadows: false\r\n' +
        '      },\r\n' +
        '      on: {\r\n' +
        '        resize: function() {\r\n' +
        '          this.params.coverflowEffect.stretch = stretchAcount()\r\n' +
        '        }\r\n' +
        '      },\r\n'
      }
      text += '  });\r\n'
    }
    text += '});'
    fs.writeFile(dir, text, (err) => {
      if (err) {
        console.log('出错了')
        reject(err)
      } else {
        console.log('main.js写入成功')
        resolve(true)
      }
    })
  })
}

// 生成html
const createFile = async (dir, namepy, reqData, gameDir) => {
  const pc1 = await renderFuc(path.join(__dirname, dir + 'index.ejs'), path.join(gameDir, namepy, 'index.html'), reqData, 1) // 生成首页
  const pc2 = await renderFuc(path.join(__dirname, dir + 'news.ejs'), path.join(gameDir, namepy, 'news.html'), reqData, 2) // 生成游戏资讯
  const pc3 = await renderFuc(path.join(__dirname, dir + 'news.ejs'), path.join(gameDir, namepy, 'raiders.html'), reqData, 3) // 生成游戏攻略
  const pc4 = await renderFuc(path.join(__dirname, dir + 'gift.ejs'), path.join(gameDir, namepy, 'gift.html'), reqData, 4) // 生成礼包中心
  const pc5 = await renderFuc(path.join(__dirname, dir + 'details.ejs'), path.join(gameDir, namepy, 'news_details.html'), reqData, 2) // 生成资讯详情
  const pc6 = await renderFuc(path.join(__dirname, dir + 'details.ejs'), path.join(gameDir, namepy, 'raiders_details.html'), reqData, 3) // 生成攻略详情
  const success = [pc1, pc2, pc3, pc4, pc5, pc6]
  const consoleT = consoleText(success)
  console.log('\n' + consoleT + '\n')
}

// 但因对应成功失败
const consoleText = (success) => {
  let text = ''
  const htmlList = ['首页', '游戏资讯', '游戏攻略', '礼包中心', '资讯详情', '攻略详情']
  for (let i = 0; i < success.length; i++) {
    text += htmlList[i] + ':' + success[i] + ' '
  }
  return text
}

app.post('/bulid', async (req, res) => {
  const reqData = req.body
  const namepy = pyfl(req.body.name).toLowerCase()
  switch (req.query.action) {
    case 'htmlPC': { // 创建html结点
      try {
        if (reqData.fullScreen) {
          await copyFuc(path.join(gameDir, 'public_resource'), path.join(gameDir, namepy))
        } else {
          await copyFuc(path.join(gameDir, 'public_resource_2'), path.join(gameDir, namepy))
        }
        console.log('\n基本静态资源已创建\n')
        const dir = path.join(gameDir, namepy) + '/js/main.js'
        await buildMainjs(reqData, dir)
        await createFile('views/pc/', namepy, reqData, gameDir)
        console.log(`http://127.0.0.1:${port}/games/${namepy}`)
        res.send({
          status: true,
          msg: '创建成功'
        })
      } catch (e) {
        console.log(e)
        res.send({
          status: false,
          msg: '创建失败'
        })
      }
      break
    }
    case 'htmlMobile': { // 创建html结点
      try {
        await copyFuc(path.join(mgameDir, 'public_resource'), path.join(mgameDir, namepy))
        console.log('\n' + '基本静态资源已创建')
        const dir = path.join(mgameDir, namepy) + '/js/main.js'
        await mbuildMainjs(reqData, dir)
        await createFile('views/mobile/', namepy, reqData, mgameDir)
        console.log(`http://127.0.0.1:${port}/mgames/${namepy}`)
        res.send({
          status: true,
          msg: '创建成功'
        })
      } catch (e) {
        console.log(e)
        res.send({
          status: false,
          msg: '创建失败'
        })
      }
      break
    }
  }
})
const port = 80
app.set('port', process.env.PORT || port) // 设定监听端口
const server = app.listen(app.get('port'), () => { // 启动监听
  console.log(`http://127.0.0.1:${port}`)
  debug('Express server listening on port ' + server.address().port)
})
