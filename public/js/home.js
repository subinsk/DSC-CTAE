if($(window).width()<1130){
    $('.cards').css({'display':'none'})
    $('.carousel').css({'display':'block'})

}
else{
    $('.cards').css({'display':'flex'})   
    $('.carousel').css({'display':'none'})
}

var slideIndex=1;
showSlides(slideIndex);

function changeSlides(n){
    showSlides(slideIndex+=n);
}

function currentSlide(n){
    showSlides(slideIndex=n);
}

function showSlides(n){
    var i;
    var slides = document.querySelectorAll('.slide');
    var lines= document.querySelectorAll('.line');

    if(n>slides.length){
        slideIndex=1;
    }
    if(n<1){
        slideIndex=slides.length;
    }

    for(i=0;i<slides.length;i++){
        slides[i].style.display="none";
    }
    for(i=0;i<lines;i++){
        slides[i].className= slides[i].className.replace(' active','');
    }

    slides[slideIndex-1].style.display="flex";
    dots[slideIndex-1].className+="active";
}
