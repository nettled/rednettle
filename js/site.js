var site = {
  init : function () {
    var $articles = $('.projects section'),
        viewport = $(window).width();
    if ($articles.length > 3 && viewport > 481) {
        $articles.each(function (i) {
            if (i > 3) {
                $(this).addClass('hidden');
            }
        });
        site.setShowMore();
    }
    site.setNav();
    site.setForm();
    $('input[required]').before('<span class="required">required</span>');
    if (viewport > 481) {
      site.setScrollEffects();
    }
  },
  setNav : function () {
    $('nav a, .toTop').on('click',function(e){
        var $lnk = $(this),
            offset = 15;
        $('html, body').stop().animate({
            scrollTop: $($lnk.attr('href')).offset().top-offset
        }, 1000);
        e.preventDefault();
    });
  },
  setForm : function () {
    $('#contactForm').on('submit',function(e){
        var $this = $(this),
            check = {'name':{'type':'text'},'email':{'type':'email'}},
            validate = {},
            functionCall;
        validate['email']= function(email){
          var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          if( !emailReg.test( email ) ) {
            return false;
          } else {
            return true;
          }
        };
        validate['text']= function(text){
           return true;
        };
        $.each(check,function(i,v){
          if(!$this.find('#'+i).val()){
            $this.find('#'+i).addClass('error');
          }
          else {
            functionCall = (check[i]['type']).toString();
            if(!validate[functionCall]($this.find('#'+i).val())){
              $this.find('#'+i).addClass('error');
            }
            else {
              $this.find('#'+i).removeClass('error');
            }
          }
        });
        e.preventDefault(); 
        if(!$('.error').length>0){
           site.sendForm();
          }
    });
  },
  sendForm : function () {
    $('#submit').val('Sending...');
    $.ajax({
       type: 'POST',
       url: 'sendMail.php',
       data: $('#contactForm').serialize(),
       success: function(data){
        console.log(data);
         if(data['status']){
          $('#submit').val('Thank you - we\'ll be in touch soon.').attr('disabled','disabled')
         }
         else {
          $('#submit').val('Send Mail - Try Again!');
         }
       }
    });
  },
  setShowMore : function () {
    var $showLink = $('<span id="showMore">Show More</span>');
    $('.hidden:last').after($showLink);
    $('#showMore').on('click', function(){
      var text = $(this).text() == 'Show More' ? 'Show Less' : 'Show More';
      $('.hidden').slideToggle('fast');
      $('#showMore').text(text).toggleClass('open');
    });
  },
  setScrollEffects : function () {
    $(window).scroll( function() {
      var w = $(this).scrollTop();;
      $('.intro, nav').css({
        'opacity' : 1-(w/400)
      });
      $('header').css({
        'background-position' : '0 ' + Math.round(w/2)+'px'
      });
    });
  }
};
site.init();