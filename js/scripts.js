$(function() {    
    
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

$(".button-collapse").sideNav({edge: 'right'});

$(document).ready(function() {
  $('.modal').modal();
});

$.ajax({
  type: "GET",
  url: "http://api.gentilgames.com/v1/courses?max_results=100",
  dataType: 'json',
  async: false,
  headers: {
    "Authorization": "Basic " + btoa("user:1")
  },
  success: function (data) {
    var tpl = '<a href="${link}" target="_blank" class="collection-item avatar"><i class="material-icons circle blue">trending_up</i><span class="title middle">${title}</span></a>';
    var items = data._items;
    var courses = [];

    items.forEach(function (item) {
      var course = {
        title: item.title.pt_br || item.title.en,
        link: 'http://app.gentilgames.com/#/home/' + item._id
      };

      $.tmpl(tpl, course).appendTo('#courses');  
    });      

  }
});