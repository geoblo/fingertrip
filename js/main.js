$(function() {
  // Slider
  const swiper = new Swiper('.swiper', {
    loop: true,
    // centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // ScrollReveal
  let slide = {
    distance: '150%',
    duration: 800,
    reset: true
  };
  
  ScrollReveal().reveal('.slide-left', { ...slide, origin: 'left' });
  ScrollReveal().reveal('.slide-right', { ...slide, origin: 'right' });
});