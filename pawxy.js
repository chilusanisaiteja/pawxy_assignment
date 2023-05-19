var apiKey = "AIzaSyAq41ZgCNe5hEC1J7_wbzvLj2Lv54VrJNA"; // Replace with your YouTube API key
var query = "";
var nextPageToken = "";
var prevPageToken = "";

document.addEventListener("DOMContentLoaded", function() {
  var searchInput = document.getElementById("search");
  searchInput.addEventListener("keypress", function(event) {
    if (event.which === 13) {
      event.preventDefault();
      query = searchInput.value;
      searchVideos(query);
      renderSearchValue(query);
    }
  });

   function renderSearchValue(query) {
     document.getElementById("searchvalue").innerHTML = "Search "+query + " on Google";
   }

  var prevButton = document.getElementById("prev");
  prevButton.addEventListener("click", function() {
    searchVideos(query, prevPageToken);
  });

  var nextButton = document.getElementById("next");
  nextButton.addEventListener("click", function() {
    searchVideos(query, nextPageToken);
  });

  var results = document.getElementById("results");
  results.addEventListener("click", function(event) {
  var clickedElement = event.target;
  var li = clickedElement.closest("li");

  if (li && li.parentElement === results) {
    var videoUrl = li.dataset.url;
    showVideoDetails(videoUrl);
  }
  });

   var viewButton = document.getElementById("view-button");
   viewButton.addEventListener("click", function () {
     var videoUrl = getVideoUrl();
     openVideoInNewTab(videoUrl);
   });

   function getVideoUrl() {
     var videoPlayer = document.getElementById("video-player");
     var iframe = videoPlayer.querySelector("iframe");
     if (iframe) {
       var src = iframe.getAttribute("src");
       var videoId = src.match(/embed\/(.*)/)[1];
       return "https://www.youtube.com/watch?v=" + videoId;
     }
     return "";
   }

   function openVideoInNewTab(url) {
     if (url) {
       window.open(url, "_blank");
     }
   }

  function searchVideos(query, pageToken = "") {
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=" + query + "&key=" + apiKey + "&pageToken=" + pageToken + "&maxResults=6";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var items = data.items;
        nextPageToken = data.nextPageToken;
        prevPageToken = data.prevPageToken;

        results.innerHTML = "";

        if (items.length > 0) {
          items.forEach(function(item) {
            var videoId = item.id.videoId;
            var title = item.snippet.title;
            var thumbnail = item.snippet.thumbnails.default.url;
            var videoUrl = "https://www.youtube.com/watch?v=" + videoId;

            var li = document.createElement("li");
            li.dataset.url = videoUrl;
            var img = document.createElement("img");
            img.src = thumbnail;
            var span = document.createElement("span");
            span.textContent = title;
            span.classList.add("title");

            li.appendChild(img);
            li.appendChild(span);
            results.appendChild(li);
          });
        } else {
          results.innerHTML = "No videos found.";
        }

        updatePagination();
      } else {
        console.error("Request failed. Status: " + xhr.status);
      }
    };
    xhr.send();
  }


  var closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", function () {
      closeVideoDetails();
    });

  function showVideoDetails(videoUrl) {
    var videoDetails = document.getElementById("video-details");
    var videoPlayer = document.getElementById("video-player");
    videoPlayer.innerHTML = `
      <iframe width="560" height="315" src="${videoUrl.replace(
        "watch?v=",
        "embed/"
      )}" frameborder="0" allowfullscreen></iframe>
    `;
    videoDetails.style.display = "block";
  }

    function closeVideoDetails() {
      var videoDetails = document.getElementById("video-details");
      var videoPlayer = document.getElementById("video-player");
      videoPlayer.innerHTML = "";
      videoDetails.style.display = "none";
    }

  function updatePagination() {
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");

    if (prevPageToken) {
      prevButton.disabled = false;
    } else {
      prevButton.disabled = true;
    }

    if (nextPageToken) {
      nextButton.disabled = false;
    } else {
      nextButton.disabled = true;
    }
  }
});
