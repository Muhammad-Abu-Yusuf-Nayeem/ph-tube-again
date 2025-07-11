function getTimeString(time) {
  const day = parseInt(time / (3600 * 24));
  time = time % (3600 * 24);
  const hour = parseInt(time / 3600);
  time = time % 3600;
  const min = parseInt(time / 60);
  time = time % 60;
  const sec = time;

  return `${day}d ${hour}h ${min}m ${sec}s ago`;
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  console.log(buttons);
  for (let btn of buttons) {
    btn.classList.remove("active");
  }
};
// 1 - fetch, load and show categories on html

// create loadCategories
const loadCategories = () => {
  console.log("load categories");

  //fetch the data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};
const loadDetails = async (videoId) => {
  console.log(videoId);
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(uri);
  const data = await res.json();
  displayDetails(data.video);
};
const displayDetails = (video) => {
  const detailContainer = document.getElementById("modal-content");
  //way 1
  // document.getElementById("showModalData").click();

  // way 2
  document.getElementById("customModal").showModal();

  detailContainer.innerHTML = `
    <img src=${video.thumbnail}>
    <p>${video.description}</p>
  `;
};

//loadVideos
const loadVideos = (searchText = "") => {
  console.log("load videos");

  //fetch the data
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

const loadCategoryVideos = (id) => {
  //fetch the data
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      //remove active class
      removeActiveClass();
      //make active button css apply
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
};
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
      <div class="min-h-[300px] w-full flex flex-col gap-5 justify-center items-center">
        <img src="assets/Icon.png">
        <h2 class="font-bold text-2xl">No Content Here in this Category</h2>
      </div>
    `;
  } else {
    videoContainer.classList.add("grid");
  }
  videos.forEach((video) => {
    console.log(video);
    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
    <figure class= "h-[200px] relative">
    <img
      src=${video.thumbnail}
      class= "h-full w-full object-cover"
      alt="Shoes" />
       <!-- optional chaining operator '?.' -->
      ${
        video.others.posted_date?.length == 0
          ? ""
          : `<span class="absolute text-sm right-2 bottom-2 bg-black text-white rounded p-1">${getTimeString(
              video.others.posted_date
            )}</span>`
      }
      
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
    <img class="w-[40px] h-[40px] rounded-full object-cover" src=${
      video.authors[0].profile_picture
    }>
  </div>
  <div>
    <p class="text-lg font-bold">${video.title}</p>
    <div class="flex items-center gap-2">
    <p class="text-gray-600">
      ${video.authors[0].profile_name}
    </p>
    
    ${
      video.authors[0].verified == true
        ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=48&id=SRJUuaAShjVD&format=png" alt="">`
        : ""
    }
  </div>
    <p><button onclick="loadDetails('${
      video.video_id
    }')" class="btn btn-sm btn-error">Details</button></p>
  </div>
  </div>
    `;
    videoContainer.append(card);
  });
};

//create DisplayCategories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  //add data in html
  categories.forEach((item) => {
    console.log(item);
    //create button
    // const button = document.createElement("button");
    // button.classList = "btn";
    // button.innerText = item.category;
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
      <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class= "btn category-btn">
        ${item.category}
      </button>
    `;

    // add button to category container
    categoryContainer.append(buttonContainer);
  });
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});
loadCategories();
loadVideos();
