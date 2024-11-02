// Look at console
$(document).ready(function () {
  var loginUsername;
  var loginPassword;
  var account = [loginUsername, loginPassword];

  $('#login-button').on('click', function () {
    var loginUsernameEntry = $("#login-username").val();
    var loginPasswordEntry = $("#login-password").val();
    if (loginUsernameEntry == account[0] && loginPasswordEntry == account[1]) {
      console.log("Current Username " + account[0]);
      console.log("Current Password " + account[1]);
      console.log("Logged In");
      window.location.href = "../Pages/home.html";
    } else {
      console.log("Attempted Username " + loginUsernameEntry);
      console.log("Attempted Password " + loginPasswordEntry);
      console.log("Login Falied");
    };
  });

  $('#create-button').on('click', function () {
    var createUsernameEntry = $("#create-username").val();
    var createPasswordEntry = $("#create-password").val();
    var createEmailEntry = $("#create-email").val();
    var createUsernameValid = false;
    var createPasswordValid = false;
    var createEmailValid = false;
    var createUsernameObject = $("#create-username");
    var createPasswordObject = $("#create-password");
    var createEmailObject = $("#create-email");
    var validate = /^\s*[a-zA-Z0-9,\s]+\s*$/;
    var validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!validate.test(createUsernameEntry) || (createUsernameEntry).length == 0) {
      $(createUsernameObject).addClass("error")
      $(createUsernameObject).val("No special characters or spaces.")
    } else {
      createUsernameValid = true;
      var createUsername = $(createUsernameObject).val();
    }

    if (!validate.test(createPasswordEntry) || (createPasswordEntry).length == 0) {
      $(createPasswordObject).addClass("error");
      $(createPasswordObject).val("No special characters or spaces.");
    } else {
      createPasswordValid = true;
      var createPassword = $(createPasswordObject).val();
    }

    if (!validateEmail.test(createEmailEntry)) {
      $(createEmailObject).addClass("error");
      $(createEmailObject).val("Enter a valid email");
    } else {
      createEmailValid = true;
      console.log("Account Email " + createEmailObject.val())
    }

    $(createUsernameObject).on('click', function () {
      $(this).val("");
      $(this).removeClass("error");
    });

    $(createPasswordObject).on('click', function () {
      $(this).val("");
      $(this).removeClass("error");
    });

    $(createEmailObject).on('click', function () {
      $(this).val("");
      $(this).removeClass("error");
    });

    account = [createUsername, createPassword];
    console.log("Account Username " + account[0]);
    console.log("Account Password " + account[1]);

    if (createUsernameValid == true && createPasswordValid == true && createEmailValid == true) {
      $('form').animate({
        height: "toggle",
        opacity: "toggle"
      }, "fast");
    }
  });

  $('.message a').on('click', function () {
    $('form').animate({
      height: "toggle",
      opacity: "toggle"
    }, "fast");
  });
});

const myHeaders = new Headers();
myHeaders.append("x-apihub-key", "ofbel0RCR9Uegh1-HAIw2QnrVPK84F0OHlPK7QxGdyM5C1jmCR");
myHeaders.append("x-apihub-host", "Movies-Verse.allthingsdev.co");
myHeaders.append("x-apihub-endpoint", "dae9e3d3-6b6c-4fde-b298-ada2806ae563");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};



//Home fetch
fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/most-popular-movies", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#trendingCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      const itemsPerSlide = window.innerWidth < 576 ? 1 : (window.innerWidth < 768 ? 2 : 4);

      data.movies.forEach((movie, index) => {
        const timeline = movie.timeline || "Unknown";
        const imdb = movie.imdbRating || "N/A";

        carouselItem += `
          <div class="col-md-${12 / itemsPerSlide}">
            <div class="card bg-dark text-black" style="width: 100%;">
              <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="text-overlay">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        // Start a new carousel item after the specified number of movies
        if ((index + 1) % itemsPerSlide === 0) {
          carouselItem += `</div></div>`; // Close row and item
          carouselInner.insertAdjacentHTML('beforeend', carouselItem);
          carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
        }
      });

      // Add remaining movies if any
      if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
        carouselItem += `</div></div>`;
        carouselInner.insertAdjacentHTML('beforeend', carouselItem);
      }

      // Add event listeners to the "View Details" buttons
      document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function () {
          const movie = JSON.parse(this.getAttribute('data-movie'));

          // Save movie data to localStorage
          localStorage.setItem('selectedMovie', JSON.stringify(movie));

          // Redirect to the individual movie page
          window.location.href = "../Pages/singlepage.html";
        });
      });
    } else {
      console.error("API response does not contain an array of movies.");
    }
  })
  .catch(error => console.error(error));

fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=action", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#continueCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      // Limit to the first movie
      const moviesToShow = data.movies.slice(0, 1);
      let carouselItem = `<div class="carousel-item active"><div class="row">`;

      moviesToShow.forEach((movie) => {
        const timeline = movie.timeline || "Unknown";
        const imdb = movie.imdbRating || "N/A";
        const progressPercentage = Math.random() * 100; // Simulating progress; replace with actual data as needed

        carouselItem += `
          <div class="col-md-3"> <!-- Change to col-md-3 for four columns -->
            <div class="card bg-dark text-black" style="width: 100%;">
              <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="text-overlay">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">IMDB: ${imdb}</p>
                  <div class="progress" style="height: 8px; margin-top: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%; background-color: #6100c2;" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      carouselItem += `</div></div>`; // Close row and item
      carouselInner.insertAdjacentHTML('beforeend', carouselItem);

    } else {
      console.error("API response does not contain an array of movies.");
    }
  })
  .catch(error => console.error(error));


fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-250-movies", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#discoverCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      const itemsPerSlide = window.innerWidth < 576 ? 1 : (window.innerWidth < 768 ? 2 : 4);

      data.movies.forEach((movie, index) => {
        const timeline = movie.timeline || "Unknown";
        const imdb = movie.imdbRating || "N/A";

        carouselItem += `
          <div class="col-md-${12 / itemsPerSlide}">
            <div class="card bg-dark text-black" style="width: 100%;">
              <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="text-overlay">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        // Start a new carousel item after the specified number of movies
        if ((index + 1) % itemsPerSlide === 0) {
          carouselItem += `</div></div>`; // Close row and item
          carouselInner.insertAdjacentHTML('beforeend', carouselItem);
          carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
        }
      });

      // Add remaining movies if any
      if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
        carouselItem += `</div></div>`;
        carouselInner.insertAdjacentHTML('beforeend', carouselItem);
      };

      // Add event listeners to the "View Details" buttons
      document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function () {
          const movie = JSON.parse(this.getAttribute('data-movie'));

          // Save movie data to localStorage
          localStorage.setItem('selectedMovie', JSON.stringify(movie));

          // Redirect to the individual movie page
          window.location.href = "../Pages/singlepage.html";
        });
      });
    } else {
      console.error("API response does not contain an array of movies.");
    }
  })
  .catch(error => console.error(error));


//Discovery fetch
fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=action", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#actionCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      const itemsPerSlide = window.innerWidth < 576 ? 1 : (window.innerWidth < 768 ? 2 : 4);

      data.movies.forEach((movie, index) => {
        const timeline = movie.timeline || "Unknown";
        const imdb = movie.imdbRating || "N/A";

        carouselItem += `
          <div class="col-md-${12 / itemsPerSlide}">
            <div class="card bg-dark text-black" style="width: 100%;">
              <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="text-overlay">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        // Start a new carousel item after the specified number of movies
        if ((index + 1) % itemsPerSlide === 0) {
          carouselItem += `</div></div>`; // Close row and item
          carouselInner.insertAdjacentHTML('beforeend', carouselItem);
          carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
        }
      });

      // Add remaining movies if any
      if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
        carouselItem += `</div></div>`;
        carouselInner.insertAdjacentHTML('beforeend', carouselItem);
      }

      // Add event listeners to the "View Details" buttons
      document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function () {
          const movie = JSON.parse(this.getAttribute('data-movie'));

          // Save movie data to localStorage
          localStorage.setItem('selectedMovie', JSON.stringify(movie));

          // Redirect to the individual movie page
          window.location.href = "../Pages/singlepage.html";
        });
      });
    } else {
      console.error("API response does not contain an array of movies.");
    }
  })
  .catch(error => console.error(error));

fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=romance", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#romanceCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      const itemsPerSlide = window.innerWidth < 576 ? 1 : (window.innerWidth < 768 ? 2 : 4);

      data.movies.forEach((movie, index) => {
        const timeline = movie.timeline || "Unknown";
        const imdb = movie.imdbRating || "N/A";

        carouselItem += `
          <div class="col-md-${12 / itemsPerSlide}">
            <div class="card bg-dark text-black" style="width: 100%;">
              <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="text-overlay">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        // Start a new carousel item after the specified number of movies
        if ((index + 1) % itemsPerSlide === 0) {
          carouselItem += `</div></div>`; // Close row and item
          carouselInner.insertAdjacentHTML('beforeend', carouselItem);
          carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
        }
      });

      // Add event listeners to the "View Details" buttons
      document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function () {
          const movie = JSON.parse(this.getAttribute('data-movie'));

          // Save movie data to localStorage
          localStorage.setItem('selectedMovie', JSON.stringify(movie));

          // Redirect to the individual movie page
          window.location.href = "../Pages/singlepage.html";
        });
      });
    } else {
      console.error("API response does not contain an array of movies.");
    }
  })
  .catch(error => console.error(error));

  fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=family", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#fanmilyCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      const itemsPerSlide = window.innerWidth < 576 ? 1 : (window.innerWidth < 768 ? 2 : 4);

      data.movies.forEach((movie, index) => {
        const timeline = movie.timeline || "Unknown";
        const imdb = movie.imdbRating || "N/A";

        carouselItem += `
          <div class="col-md-${12 / itemsPerSlide}">
            <div class="card bg-dark text-black" style="width: 100%;">
              <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="text-overlay">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        // Start a new carousel item after the specified number of movies
        if ((index + 1) % itemsPerSlide === 0) {
          carouselItem += `</div></div>`; // Close row and item
          carouselInner.insertAdjacentHTML('beforeend', carouselItem);
          carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
        }
      });

      // Add remaining movies if any
      if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
        carouselItem += `</div></div>`;
        carouselInner.insertAdjacentHTML('beforeend', carouselItem);
      }

      // Add event listeners to the "View Details" buttons
      document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function () {
          const movie = JSON.parse(this.getAttribute('data-movie'));

          // Save movie data to localStorage
          localStorage.setItem('selectedMovie', JSON.stringify(movie));

          // Redirect to the individual movie page
          window.location.href = "../Pages/singlepage.html";
        });
      });
    } else {
      console.error("API response does not contain an array of movies.");
    }
  })
  .catch(error => console.error(error));

  fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=horror", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#horrorCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      const itemsPerSlide = window.innerWidth < 576 ? 1 : (window.innerWidth < 768 ? 2 : 4);

      data.movies.forEach((movie, index) => {
        const timeline = movie.timeline || "Unknown";
        const imdb = movie.imdbRating || "N/A";

        carouselItem += `
          <div class="col-md-${12 / itemsPerSlide}">
            <div class="card bg-dark text-black" style="width: 100%;">
              <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="text-overlay">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        // Start a new carousel item after the specified number of movies
        if ((index + 1) % itemsPerSlide === 0) {
          carouselItem += `</div></div>`; // Close row and item
          carouselInner.insertAdjacentHTML('beforeend', carouselItem);
          carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
        }
      });

      // Add remaining movies if any
      if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
        carouselItem += `</div></div>`;
        carouselInner.insertAdjacentHTML('beforeend', carouselItem);
      }

      // Add event listeners to the "View Details" buttons
      document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function () {
          const movie = JSON.parse(this.getAttribute('data-movie'));

          // Save movie data to localStorage
          localStorage.setItem('selectedMovie', JSON.stringify(movie));

          // Redirect to the individual movie page
          window.location.href = "../Pages/singlepage.html";
        });
      });
    } else {
      console.error("API response does not contain an array of movies.");
    }
  })
  .catch(error => console.error(error));


//Library Fetch
document.addEventListener('DOMContentLoaded', function() {
  fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=action", requestOptions)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      console.log(data); // Check the structure of the returned data
      if (data && data.movies) {
        const carouselInner = document.querySelector('#continueLibrary .carousel-inner');
        carouselInner.innerHTML = '';

        let carouselItem = `<div class="carousel-item active"><div class="row">`;
        data.movies.forEach((movie, index) => {
          const timeline = movie.timeline || "Unknown";
          const imdb = movie.imdbRating || "N/A";
          const progressPercentage = Math.floor(Math.random() * 101);

          carouselItem += `
            <div class="col-md-3">
              <div class="card bg-dark text-black" style="width: 100%;">
                <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
                <div class="card-img-overlay d-flex flex-column justify-content-end">
                  <div class="text-overlay">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.year} / ${timeline}</p>
                    <p class="card-text">IMDB: ${imdb}</p>
                    <div class="progress" style="height: 8px; margin-top: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%; background-color: #6100c2;" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;

          // Start a new carousel item after every 4 movies
          if ((index + 1) % 4 === 0) {
            carouselItem += `</div></div>`; // Close row and item
            carouselInner.insertAdjacentHTML('beforeend', carouselItem);
            carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
          }
        });

        // Add remaining movies if any
        if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
          carouselItem += `</div></div>`;
          carouselInner.insertAdjacentHTML('beforeend', carouselItem);
        }

        // Add event listeners to the "View Details" buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
          button.addEventListener('click', function () {
            const movie = JSON.parse(this.getAttribute('data-movie'));

            // Save movie data to localStorage
            localStorage.setItem('selectedMovie', JSON.stringify(movie));

            // Redirect to the individual movie page
            window.location.href = "../Pages/singlepage.html";
          });
        });
      } else {
        console.error("API response does not contain an array of movies.");
      }
    })
    .catch(error => console.error(error));
});


//Single page functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get the selected movie data from localStorage
  const selectedMovie = JSON.parse(localStorage.getItem("selectedMovie"));

  if (selectedMovie) {
    // Populate the movie details on the page
    document.getElementById("movie-image").src = selectedMovie.image;
    document.getElementById("movie-title").textContent = selectedMovie.title;
    document.getElementById("movie-year").textContent = selectedMovie.year;
    document.getElementById("movie-rating").textContent = selectedMovie.imdbRating || "N/A";

    const imdbLinkElement = document.createElement("h2");
    imdbLinkElement.classList.add("ml-3"); // Add ml-5 class for margin
    imdbLinkElement.innerHTML = `<a href="${selectedMovie.link || '#'}" target="_blank">View on IMDb</a>`;
    document.getElementById("movie-text").appendChild(imdbLinkElement); // Append to movie-text
  } else {
    console.error("No movie data found in localStorage");
  }
});


//Filter Buttons
function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function toggleRatingDropdown() {
  document.getElementById("ratingDropdown").classList.toggle("show");
}

// Close the dropdowns if the user clicks outside of them
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

let allMovies = {
  action: [],
  romance: [],
  family: [],
  horror: []
};

function fetchMovies() {
  const genres = ['action', 'romance', 'family', 'horror'];
  
  genres.forEach(genre => {
    fetch(`https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=${genre}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data && data.movies) {
          allMovies[genre] = data.movies; // Store all movies in an object
          populateCarousel(genre, data.movies);
        } else {
          console.error("API response does not contain an array of movies.");
        }
      })
      .catch(error => console.error(error));
  });
}

function populateCarousel(genre, movies) {
  const carouselInner = document.querySelector(`#${genre}Carousel .carousel-inner`);
  carouselInner.innerHTML = '';

  if (movies.length === 0) {
    carouselInner.innerHTML = '<p>No movies found in this rating range.</p>'; // Message for no results
    return; // Exit early if no movies
  }

  let carouselItem = `<div class="carousel-item active"><div class="row">`;
  movies.forEach((movie, index) => {
    const timeline = movie.timeline || "Unknown";
    const imdb = movie.imdbRating || "N/A";

    carouselItem += `
      <div class="col-md-3">
        <div class="card bg-dark text-black" style="width: 100%;">
          <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
          <div class="card-img-overlay d-flex flex-column justify-content-end">
            <div class="text-overlay">
              <h5 class="card-title">${movie.title}</h5>
              <p class="card-text">${movie.year} / ${timeline}</p>
              <p class="card-text">
                IMDB: ${imdb} 
                <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                  style="background-color: #6100c2; display: block; float: right;" 
                  data-movie='${JSON.stringify(movie)}'>View Details
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Start a new carousel item after every 4 movies
    if ((index + 1) % 4 === 0) {
      carouselItem += `</div></div>`; // Close row and item
      carouselInner.insertAdjacentHTML('beforeend', carouselItem);
      carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
    }
  });

  // Add remaining movies if any
  if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
    carouselItem += `</div></div>`;
    carouselInner.insertAdjacentHTML('beforeend', carouselItem);
  }

  // Add event listeners to the "View Details" buttons
  document.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', function () {
      const movie = JSON.parse(this.getAttribute('data-movie'));
      localStorage.setItem('selectedMovie', JSON.stringify(movie));
      window.location.href = "../Pages/singlepage.html";
    });
  });
}

function filterByRating(minRating, maxRating) {
  for (const genre in allMovies) {
    const filteredMovies = allMovies[genre].filter(movie => {
      const imdb = movie.imdbRating;

      // Ensure we only consider numeric ratings and ignore N/A
      if (imdb === "N/A") return false;
      const rating = parseFloat(imdb);
      
      // Adjust conditions based on the selected range
      return rating >= minRating && rating < maxRating;
    });

    // Populate carousel for the genre with filtered movies
    populateCarousel(genre, filteredMovies);
  }
}

function scrollToGenre(carouselId) {
  const element = document.getElementById(carouselId);
  element.scrollIntoView({ behavior: 'smooth' });
}

fetchMovies(); // Call the function to fetch all movies initially
