$(function(){
    $(".part-box").floor();
    $(".news-box").tab();
    $(".slide-box-1").slide();
    $(".slide-box-2").slide();
    $(".slide-box-3").slide({
      effect: "carousel",
      param: { stretch: 240, depeth: 600, opacity: 0.5 }
    });
  })