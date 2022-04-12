$(function() {
  // Enable tooltips
  let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });

  /*
    모바일(태블릿)용 메뉴 보이기/숨기기
  */
  const nav = document.querySelector(".nav");

  // 1. JS 사용
  const btnHamburger = document.querySelector(".hamburger");
  btnHamburger.addEventListener("click", () => {
    nav.style.display = "block";
  });

  // 2. jQuery 사용
  $(".close > .fa-xmark").on("click", () => {
    $(".nav").hide();
  });

  /*
    모바일(태블릿)용 메뉴에서 하위(서브)메뉴 보이기/숨기기
  */
  $("li.dropdown").click(() => {
    $(this).find("ul.lnb").toggle();
  });
  
  // $("li.dropdown").mouseover(() => {
  //   $(this).find("ul.lnb").show();
  // });
  // $("li.dropdown").mouseout(() => {
  //   $(this).find("ul.lnb").hide();
  // });
});