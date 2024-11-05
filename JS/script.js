// Look at console
$(document).ready(function () {
  $('#login-button').on('click', function () {
    var loginUsernameEntry = $("#login-username").val();
    var loginPasswordEntry = $("#login-password").val();

    // Retrieve stored account details from localStorage
    var storedUsername = localStorage.getItem("username");
    var storedPassword = localStorage.getItem("password");

    if (loginUsernameEntry === storedUsername && loginPasswordEntry === storedPassword) {
      console.log("Current Username: " + storedUsername);
      console.log("Current Password: " + storedPassword);
      console.log("Logged In");
      window.location.href = "../Pages/home.html";
    } else {
      console.log("Attempted Username: " + loginUsernameEntry);
      console.log("Attempted Password: " + loginPasswordEntry);
      console.log("Login Failed");
    }
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

    if (!validate.test(createUsernameEntry) || createUsernameEntry.length === 0) {
      $(createUsernameObject).addClass("error").val("No special characters or spaces.");
    } else {
      createUsernameValid = true;
    }

    if (!validate.test(createPasswordEntry) || createPasswordEntry.length === 0) {
      $(createPasswordObject).addClass("error").val("No special characters or spaces.");
    } else {
      createPasswordValid = true;
    }

    if (!validateEmail.test(createEmailEntry)) {
      $(createEmailObject).addClass("error").val("Enter a valid email");
    } else {
      createEmailValid = true;
      console.log("Account Email: " + createEmailObject.val());
    }

    // Clear error message on focus
    $(createUsernameObject).on('click', function () {
      $(this).val("").removeClass("error");
    });
    $(createPasswordObject).on('click', function () {
      $(this).val("").removeClass("error");
    });
    $(createEmailObject).on('click', function () {
      $(this).val("").removeClass("error");
    });

    // Save to localStorage if valid
    if (createUsernameValid && createPasswordValid && createEmailValid) {
      localStorage.setItem("username", createUsernameEntry);
      localStorage.setItem("password", createPasswordEntry);
      localStorage.setItem("email", createEmailEntry);
      console.log("Account Username: " + createUsernameEntry);
      console.log("Account Password: " + createPasswordEntry);

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
                <div class="cardText">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    </div>
                    <div class="cardButtons">
                      <button class="btn watchlist-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'> Add to Watchlist
                    </button>  
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                  </div>
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
                <div class="cardText">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.year} / ${timeline}</p>
                  <p class="card-text">
                    IMDB: ${imdb} 
                    </div>
                    <div class="cardButtons">
                      <button class="btn watchlist-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'> Add to Watchlist
                    </button>  
                    <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                      style="background-color: #6100c2; display: block; float: right;" 
                      data-movie='${JSON.stringify(movie)}'>View Details
                    </button>
                  </p>
                  </div>
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
        // Limit to a maximum of 7 movies
        const maxMovies = Math.min(data.movies.length, 7);
        for (let index = 0; index < maxMovies; index++) {
          const movie = data.movies[index];
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
          if ((index + 1) % 4 === 0 && index < maxMovies - 1) {
            carouselItem += `</div></div>`; // Close row and item
            carouselInner.insertAdjacentHTML('beforeend', carouselItem);
            carouselItem = `<div class="carousel-item"><div class="row">`; // Start new item
          }
        }

        // Close the last item if it contains any movies
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

const images = [
    'LOTR.jpg',
    'Ender.jpg',
    'deadpool.jpg',
    'Avengers.jpg',
    'SW.jpg',
    'Scream.jpg',
];

function getRandomImages() {
    // Shuffle the images array
    const shuffled = images.sort(() => 0.5 - Math.random());
    // Select the first 3 images from the shuffled array
    return shuffled.slice(0, 3);
}

function injectImages() {
    const randomImages = getRandomImages();
    // Target the specific carousel's inner container using its ID
    const carouselInner = document.querySelector('#mainCarousel .carousel-inner');
    
    // Clear existing carousel items
    carouselInner.innerHTML = '';

    randomImages.forEach((image, index) => {
        // Create a new carousel item div
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');

        // Create the image element
        const imgElement = document.createElement('img');
        imgElement.src = '../Assets/Icons/Carousel/' + image;
        imgElement.className = 'd-block w-100 img-fluid'; // Keep Bootstrap classes
        imgElement.alt = 'Random Image ' + (index + 1);

        // Append the image to the carousel item
        carouselItem.appendChild(imgElement);
        // Append the carousel item to the carousel inner
        carouselInner.appendChild(carouselItem);
    });
}

// Call the injectImages function when the window loads
window.onload = injectImages;

// Watchlist functionality
$(document).ready(function () {
  // Load the watchlist when the library page is loaded
  if (document.querySelector('#watchlist')) {
    loadWatchlist();
  }

  // Event listener for adding a movie to the watchlist
  $(document).on('click', '.watchlist-btn', function () {
    const movie = JSON.parse($(this).attr('data-movie'));
    
    // Retrieve the current watchlist from localStorage
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    // Check if the movie is already in the watchlist
    const alreadyInWatchlist = watchlist.some(item => item.title === movie.title);
    if (!alreadyInWatchlist) {
      watchlist.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      showAlert(`${movie.title} has been added to your watchlist!`, 'success');
    } else {
      showAlert(`${movie.title} is already in your watchlist.`, 'warning');
    }

    // Update the watchlist display if on library page
    if (document.querySelector('#watchlist')) {
      loadWatchlist();
    }
  });

  // Handle removal from watchlist
  $(document).on('click', '.remove-watchlist-btn', function() {
    const movieTitle = $(this).data('movie-title');
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    watchlist = watchlist.filter(movie => movie.title !== movieTitle);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    
    loadWatchlist();
    showAlert('Movie removed from watchlist', 'success');
  });
});

function loadWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const watchlistContainer = $('#watchlist .carousel-inner');
  if (!watchlistContainer.length) return;
  
  watchlistContainer.empty();

  if (watchlist.length === 0) {
    watchlistContainer.append('<div class="carousel-item active"><div class="text-white">Your watchlist is empty.</div></div>');
    return;
  }

  let carouselItem = `<div class="carousel-item active"><div class="row">`;
  const itemsPerSlide = window.innerWidth < 576 ? 1 : (window.innerWidth < 768 ? 2 : 4);

  watchlist.forEach((movie, index) => {
    carouselItem += `
      <div class="col-md-${12 / itemsPerSlide}">
        <div class="card bg-dark text-black" style="width: 100%;">
          <img src="${movie.image}" class="card-img" style="height: 600px; object-fit: cover;" alt="${movie.title}">
          <div class="card-img-overlay d-flex flex-column justify-content-end">
            <div class="text-overlay">
              <div class="cardText">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">${movie.year} / ${movie.timeline || "Unknown"}</p>
                <p class="card-text">IMDB: ${movie.imdbRating || "N/A"}</p>
              </div>
              <div class="cardButtons">
                <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" 
                  style="background-color: #6100c2; display: block; float: right;" 
                  data-movie='${JSON.stringify(movie)}'>View Details
                </button>
                <button class="btn remove-watchlist-btn btn-danger font-weight-lighter border-0 mr-3" 
                  style="background-color: #d9534f; display: block; float: right;" 
                  data-movie-title="${movie.title}">Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if ((index + 1) % itemsPerSlide === 0) {
      carouselItem += `</div></div>`;
      watchlistContainer.append(carouselItem);
      carouselItem = `<div class="carousel-item"><div class="row">`;
    }
  });

  if (carouselItem !== `<div class="carousel-item"><div class="row">`) {
    carouselItem += `</div></div>`;
    watchlistContainer.append(carouselItem);
  }
}

function showAlert(message, type) {
  const alertDiv = $('<div>')
    .addClass(`alert alert-${type} alert-dismissible fade show`)
    .attr('role', 'alert')
    .css({
      'position': 'fixed',
      'top': '20px',
      'right': '20px',
      'z-index': '1050'
    })
    .html(`
      ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `);
  
  $('body').append(alertDiv);
  
  setTimeout(() => {
    alertDiv.alert('close');
  }, 3000);
}