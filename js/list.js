$(function() {
  const tripData = JSON.parse(localStorage.getItem("tripData"));
  console.log(tripData);

  let html = '<div class="col">';
  html      += '  <div>';
  html      += `    <img src="${tripData.tripSchedule[0].placePhoto}" alt="course1">`;
  html      += '  </div>';
  html      += '  <div>';
  html      += '    <p class="text-ellipsis pt-2 pb-1">';
  html      += `      <i class="fa-solid fa-location-dot"></i>${tripData.tripTitle}`;
  html      += '    </p>';
  html      += '    <p class="py-1">';
  html      += `      <i class="fa-solid fa-pencil"></i>${tripData.author}`;
  html      += '    </p>';
  html      += '  </div>';
  html      += '</div>';

  $(".course-list-data").append(html);
  
  // <div class="col">
  //   <div>
  //     <img src="img/courselist/course-1.svg" alt="course1">
  //   </div>
  //   <div>
  //     <p class="text-ellipsis pt-2 pb-1">
  //       <i class="fa-solid fa-location-dot"></i>
  //       뜨거운 태양아래 바다 구경, 캘리포니아
  //     </p>
  //     <p class="py-1">
  //       <i class="fa-solid fa-pencil"></i>
  //       김재현
  //     </p>
  //   </div>
  // </div>
});