document.getElementById("tabs-input").addEventListener("change", function (e) {
  switch (e.target.selectedIndex) {
    case 0:
      // generation tab selected
      document.getElementById("generation").classList.remove("hidden");
      document.getElementById("edits").classList.add("hidden");
      break;
    case 1:
      // edit tab selected
      document.getElementById("edits").classList.remove("hidden");
      document.getElementById("generation").classList.add("hidden");
      break;
  }
});

document.onkeydown = function (e) {
  if (e.key === "Delete") {
    editsCanvas.remove(editsCanvas.getActiveObject());
  }
};


var editsCanvas = new fabric.Canvas("edits-canvas");
editsCanvas.setDimensions({
  width: 1024,
  height: 1024,
});

function addImage(e, canvas) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      const image = new fabric.Image(img);
      editsCanvas.add(image);
      editsCanvas.renderAll();
    };
  };
  reader.readAsDataURL(e.target.files[0]);
  e.target.value = null;
}

function eraseCanvas(ele, canvas) {
  switch (editsCanvas.isDrawingMode) {
    case true:
      editsCanvas.isDrawingMode = false;
      ele.classList.remove("bg-gray-200");
      break;
    case false:
      editsCanvas.isDrawingMode = true;
      editsCanvas.freeDrawingBrush = new fabric.EraserBrush(editsCanvas);
      editsCanvas.freeDrawingBrush.width = 50;
      ele.classList.add("bg-gray-200");
      break;
  }
}



function selectCanvas(ele, canvas) {
  editsCanvas.isDrawingMode = false;
  document.getElementById("edits-eraser").classList.remove("bg-gray-200");
}

function clearCanvas(canvas) {
  editsCanvas.clear();
}

function submit() {
  var index = document.getElementById("tabs-input").selectedIndex;
  switch (index) {
    case 0:
      requestGeneration();
      break;
    case 1:
      requestEdit();
      break;
  }
}

function displaySuccess(ele, responseData) {
  ele.querySelector(".generation-spinner").remove();
  ele.querySelector(".generation-status").textContent = "SUCCESS";
  ele.querySelector(".generation-status").classList.add("text-green-700");
  ele.querySelector(".generation-status").classList.remove("text-rose-700");
  ele.querySelectorAll(".opacity-20").forEach((ele) => {
    ele.classList.remove("opacity-20");
  });
  ele.querySelector(".placeholder").remove();
  let imgEle = document.createElement("div");
  let dataURL = responseData;
  switch (document.getElementById("size").value) {
    case "landscape":
      imgEle.innerHTML = `
        <img class="bg-center bg-[length:100%_100%] hover:bg-[length:130%_130%] hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" onclick="openLightbox(this)" style="width:42.7rem;height:24rem;background-image:url(${dataURL});">
        `;
      break;
    case "normal":
      imgEle.innerHTML = `
        <img class="bg-center bg-[length:100%_100%] hover:bg-[length:130%_130%] hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" onclick="openLightbox(this)" style="width:32rem;height:24rem;background-image:url(${dataURL});">
        `;
      break;
    case "classic":
      imgEle.innerHTML = `
        <img class="bg-center bg-[length:100%_100%] hover:bg-[length:130%_130%] hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" onclick="openLightbox(this)" style="width:36rem;height:24rem;background-image:url(${dataURL});">
        `;
      break;
    case "square":
      imgEle.innerHTML = `
        <img class="bg-center bg-[length:100%_100%] hover:bg-[length:130%_130%] hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" onclick="openLightbox(this)" style="width:24rem;height:24rem;background-image:url(${dataURL});">
        `;
      break;
    default:
      imgEle.innerHTML = `
        <img class="bg-center bg-[length:100%_100%] hover:bg-[length:130%_130%] hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" onclick="openLightbox(this)" style="width:42.7rem;height:24rem;background-image:url(${dataURL});">
        `;
      break;
  }
  ele.querySelector(".images").appendChild(imgEle);

}

function displayError(ele, error) {
  console.log(error);
  ele.querySelector(".placeholder").remove();
  ele.querySelector(".generation-spinner").remove();
  ele.querySelector(".generation-status").textContent = error;
  ele.querySelector(".generation-status").classList.add("text-rose-700");
  ele.querySelectorAll(".opacity-20").forEach((ele) => {
    ele.classList.remove("opacity-20");
  });
}


function requestGeneration() {

  // Get the data from the prompt
  let promptData = {};
  promptData.promptText = document.getElementById("generation-input").value;
  promptData.promptRes = document.getElementById("size").value;
  promptData.promptNum = 1;
  promptData.promptSave = true;

  // Append a template element
  const ele = document.createElement("div");
  let postHTML = `
  <div class="relative items-center block p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700" style="margin-start:0; margin-end:0; margin-bottom:1.5rem;">
    <h5 class="mb-1 text-base font-bold tracking-tight text-gray-900 dark:text-white opacity-20">"${promptData.promptText}"</h5>
    <span class="generation-status">PENDING</span></p>
    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 generation-spinner">
        <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        <span class="sr-only"> Loading... </span>
    </div>
    <div class="images flex gap-3 flex-wrap">
    <div class="placeholder w-64 h-64 bg-zinc-100"></div>
    </div>
    </div>
    `;
  ele.innerHTML = postHTML;


  // Add the element to the page
  document.getElementById("output").prepend(ele);

  try {
    fetch("/request/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.text();
      })
      .then((responseData) => {
        displaySuccess(ele, responseData);
      })
      .catch((error) => {
        displayError(ele, error);
      });
  } catch {
    displayError(ele, error);
  }
}


function requestEdit() {

  // Get the data from the prompt
  let promptData = {};

  promptData.promptText = document.getElementById("edits-input").value;
  promptData.promptRes = document.getElementById("size").value;
  promptData.promptNum = 1;
  promptData.promptSave = true;
  promptData.imageData = editsCanvas.toDataURL("png");


  //Append a template element
  const ele = document.createElement("div");

  let postHTML = `
  <div class="relative items-center block p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700" style="margin-start:0; margin-end:0; margin-bottom:1.5rem;">
    <h5 class="mb-1 text-base font-bold tracking-tight text-gray-900 dark:text-white opacity-20">EDIT</h5>
    <span class="generation-status">PENDING</span></p>
    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 generation-spinner">
        <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        <span class="sr-only"> Loading... </span>
    </div>
    <div class="images flex gap-3 flex-wrap">
    <div class="placeholder w-64 h-64 bg-zinc-100"></div>
    </div>
    </div>
    `;
  ele.innerHTML = postHTML;


  // Add the element to the page
  document.getElementById("output").prepend(ele);

  try {
    fetch("/request/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.text();
      })
      .then((responseData) => {
        displaySuccess(ele, responseData);
      })
      .catch((error) => {
        displayError(ele, error);
      });
  } catch {
    displayError(ele, error);
  }
}

// Function to open the lightbox
function openLightbox(image) {
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");

  // Set the src attribute of the lightbox image to the src attribute of the clicked image
  //  lightboxImage.src = image.src;
  //instead of image.src, set it to the background image url
  lightboxImage.src = image.style.backgroundImage.slice(5, -2);

  lightbox.classList.remove("hidden");
  document.addEventListener("keydown", closeLightbox);
  lightbox.addEventListener("click", closeLightbox);
}

// Function to close the lightbox
function closeLightbox(event) {
  var lightbox = document.getElementById("lightbox");

  // If the event targets img, do nothing
  if (event.target.tagName == "IMG") {
    return;
  }

  // If the event is a keydown event and the key is not the Escape key, do nothing
  if (event && event.type === "keydown" && event.key !== "Escape") {
    return;
  }

  // Remove the event listeners for the keydown and click events
  document.removeEventListener("keydown", closeLightbox);
  lightbox.removeEventListener("click", closeLightbox);
  lightbox.classList.add("hidden");
}