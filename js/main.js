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

  let spotlight = {
    distance: '0px',
    opacity: 0.2,
    duration: 1200,
    reset: true
  }
  
  ScrollReveal().reveal('.slide-up', { ...slide, origin: 'bottom' });
  ScrollReveal().reveal('.slide-down', { ...slide, origin: 'top' });
  ScrollReveal().reveal('.slide-left', { ...slide, origin: 'left' });
  ScrollReveal().reveal('.slide-right', { ...slide, origin: 'right' });
  ScrollReveal().reveal('.spotlight', spotlight);

  // Let's Finger 버튼 클릭 이벤트
  $('.btn-new-course').click(() => {
    location.href = "/pages/course.html";
  });
});