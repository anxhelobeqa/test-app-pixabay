pages = [1, 2, 3];
currentPage = 1;

categories = [
  "backgrounds",
  "fashion",
  "nature",
  "science",
  "education",
  "feelings",
  "health",
  "people",
  "religion",
  "places",
  "animals",
  "industry",
  "computer",
  "food",
  "sports",
  "transportation",
  "travel",
  "buildings",
  "business",
  "music",
];
colors = [
  "grayscale",
  "transparent",
  "red",
  "orange",
  "yellow",
  "green",
  "turquoise",
  "blue",
  "lilac",
  "pink",
  "white",
  "gray",
  "black",
  "brown",
];
orientations = ["all", "horizontal", "vertical"];
totalResults = 0;

queryParams = {
  key: "18444054-5dd822623bbe71b215845e53a",
  q: "",
  page: currentPage,
  per_page: 9,
};
// First function that runs 
(async () => {
  initAdvancedSearch();
  await onSearch();
  initPagination(pages);
})();

function initPagination(pages) {
  $(".pagination").empty();
  $(".pagination").append(`
  <li class="page-item">
  <a class="page-link page-next" onClick="previous()" tabindex="-1">Previous</a>
</li>
${pages
      .map((i) => {
        return `<li class="page-item"><a class="page-link" onClick="changePage(${i})">${i}</a></li>`;
      })
      .join("")}
<li class="page-item">
  <a class="page-link page-previous" onClick="next()" >Next</a>
</li>
  `);
}
// Change Page Function 
async function changePage(pageNumber) {
  if (pageNumber > currentPage) {
    if (pageNumber < totalResults) {
      pages = pages.map((i) => {
        return ++i;
      });
    }
  } else {
    if (pageNumber > 1) {
      pages = pages.map((i) => {
        return --i;
      });
    }
  }
  currentPage = pageNumber;
  // Pagination Function 
  initPagination(pages);
  await onSearch({
    ...queryParams,
    page: pageNumber,
  });
}
// Next Page Function  
async function next() {
  if (currentPage < totalResults) {
    ++currentPage;

    pages = pages.map((i) => {
      return ++i;
    });
  }
  initPagination(pages);

  await onSearch({
    ...queryParams,
    page: currentPage,
  });
}
// Previous Page Function 
async function previous() {
  if (currentPage > 1) {
    --currentPage;

    pages = pages.map((i) => {
      return --i;
    });
  }

  initPagination(pages);
  await onSearch({
    ...queryParams,
    page: currentPage,
  });
}
// Filter Function
function initAdvancedSearch() {
  $(".advanced-search-selectboxes").append(
    initSelectBox("Category", categories, "category")
  );
  $(".advanced-search-selectboxes").append(
    initSelectBox("Color", colors, "color")
  );
  $(".advanced-search-selectboxes").append(
    initSelectBox("Orienation", orientations, "orientation")
  );

  const customSelects = document.querySelectorAll("select");
  const deleteBtn = document.getElementById("delete");
  const choices = new Choices("select", {
    searchEnabled: false,
    itemSelectText: "",
    removeItemButton: true,
  });
  for (let i = 0; i < customSelects.length; i++) {
    customSelects[i].addEventListener(
      "addItem",
      function (event) {
        if (event.detail.value) {
          let parent = this.parentNode.parentNode;
          parent.classList.add("valid");
          parent.classList.remove("invalid");
        } else {
          let parent = this.parentNode.parentNode;
          parent.classList.add("invalid");
          parent.classList.remove("valid");
        }
      },
      false
    );
  }
  deleteBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const deleteAll = document.querySelectorAll(".choices__button");
    for (let i = 0; i < deleteAll.length; i++) {
      deleteAll[i].click();
    }
  });
}

function initSelectBox(title, options, queryParamKey) {
  return `<div class="input-field">
  <div class="input-select">
    <select data-trigger="" id="${queryParamKey}" onChange="setQueryParam('${queryParamKey}')"name="choices-single-default">
      <option style="display:none" placeholder="${title}" value="" >${title}</option>
      ${options
      .map(
        (option) =>
          `<option value="${option}")">${toTitleCase(option)}</option>`
      )
      .join("")}
    </select>
  </div>
</div>`;
}

function setQueryParam(key) {
  console.log($(`#${key}`).val());
  queryParams[key] = $(`#${key} :selected`).val();
}

function reset() {
  queryParams.q = "";
  $("#search").val(" ");
  $("#category").val(" ");
  queryParams.category = "";
  $("#orientation").val(" ");
  queryParams.orientation = "";
  $("#color").val(" ");
  queryParams.color = "";
}
// Input  on Search / Axios request / Output  
async function onSearch(query = queryParams) {
  try {

    const searchTerm = $("#search").val();
    query.q = searchTerm;

    const response = await axios.get(`https://pixabay.com/api`, {
      params: query,
    });

    const data = response.data;
    $(".results-count-value").text(data.total);
    totalResults = data.total;
    $(".photo-container").empty();

    data.hits.map((image) => {
      $(".photo-container").append(getPhotoCard(image));
    });
  } catch (e) {

    console.log(e);
  }
}

function onImageClick(image) {
  $(".large-image").attr("src", `${image}`);
}

function getPhotoCard(image) {
  return `  <div class="col-md-4">
  <div class="card mb-4 shadow-sm image-container" onClick="onImageClick('${image.largeImageURL}')" data-toggle="modal" data-target="#exampleModal">
    <img class="preview-image" src="${image.webformatURL}">
  
      
      <div class="image-info d-flex justify-content-around align-items-center">
      <span> 
      <i class="fas fa-thumbs-up"></i>
      ${image.likes}
      </span>
      
          <span> 
          <i class="fas fa-star"></i>
        ${image.favorites}
        </span>
        <span> 
        <i class="fas fa-comment"></i>
        ${image.comments}
        </span>
      </div>
           
        </div>
      </div>
  </div>
</div>`;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
