moment.locale('pt-Br');

$(function() {    
  
  $('.slick-header').slick({
    dots: true,
    infinite: false,
    fade: true,
    // autoplay: true,
    // autoplaySpeed: 2000,
  });

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

  $('#validar-certificado').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      complete: function() { 
        $("#certificado-validado").html(null);
        $("#cod-certificado").val("");
      }
    }
  );
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
    console.log(data);
    var tpl = '<li class="course-item"><a href="${link}" target="_blank"><div class="course-content">${title}</div></a></li>';
    var items = data._items;
    var courses = [];

    items.forEach(function (item) {
      var course = {
        title: item.title.pt_br || item.title.en,
        link: 'http://app.gentilgames.com/#/home/' + item._id
      };

      $.tmpl(tpl, course).appendTo('#courses');  
    });      

    $('.course-list').slick({
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      responsive: [{
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        }, {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }]
    });

  }
});

$("#validar-certificado-btn").click(function() {
  var certificateId = $("#cod-certificado").val();
  $.ajax({
    type: "GET",
    url: "http://api.gentilgames.com/v1/certificates/" + certificateId,
    dataType: 'json',
    async: false,
    headers: {
      "Authorization": "Basic " + btoa("user:1")
    },
    success: function (data) {
      console.log(data);
      var tpl = '<h5 style="text-align: center">Certificado Válido</h4><p><strong>Nome: </strong>${name}</p><p><strong>CPF: </strong>${cpf}</p><p><strong>Passaporte: </strong>${passaport}</p><p><strong>Data: </strong>${date}</p>';

      var certificateData = {
        name: data.profile.name,
        cpf: data.profile.cpf ? data.profile.cpf : 'Não informado' ,
        passaport: data.profile.passaport ? data.profile.passaport : 'Não informado',
        date: moment(data._created).calendar()
      }

      $("#certificado-validado").html('');
      $.tmpl(tpl, certificateData).appendTo('#certificado-validado');
    },
    error: function(req) {
      $("#certificado-validado").html('<h5 style="color: red; text-align: center">Certificado Inválido</h5>');
    }
  });
})