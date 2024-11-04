// JQuery login and signup
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
      data.movies.forEach((movie, index) => {
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
                  <p class="card-text">IMDB: ${imdb}</p>
                  <!-- Button to go to the individual movie page -->
                  <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" style="background-color: #6100c2;" data-movie='${JSON.stringify(movie)}'>View Details</button>
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



fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=action", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#continueCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      // Limit to the first five movies
      const moviesToShow = data.movies.slice(0, 4);
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
                    <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%; background-color: #28a745;" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
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
      data.movies.forEach((movie, index) => {
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
                  <p class="card-text">IMDB: ${imdb}</p>
                  <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" style="background-color: #6100c2;" data-movie='${JSON.stringify(movie)}'>View Details</button>
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

  fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=action", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#actionCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      data.movies.forEach((movie, index) => {
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
                  <p class="card-text">IMDB: ${imdb}</p>
                  <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" style="background-color: #6100c2;" data-movie='${JSON.stringify(movie)}'>View Details</button>
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

  fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=romance", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#romanceCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      data.movies.forEach((movie, index) => {
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
                  <p class="card-text">IMDB: ${imdb}</p>
                  <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" style="background-color: #6100c2;" data-movie='${JSON.stringify(movie)}'>View Details</button>
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

  fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=family", requestOptions)
  .then(res => res.json())
  .then(data => {
    if (data && data.movies) {
      const carouselInner = document.querySelector('#fanmilyCarousel .carousel-inner');
      carouselInner.innerHTML = '';

      let carouselItem = `<div class="carousel-item active"><div class="row">`;
      data.movies.forEach((movie, index) => {
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
                  <p class="card-text">IMDB: ${imdb}</p>
                  <button class="btn view-details-btn btn-primary font-weight-lighter border-0 mr-3" style="background-color: #6100c2;" data-movie='${JSON.stringify(movie)}'>View Details</button>
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
    } else {
      console.error("API response does not contain an array of movies.");
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
  })
  .catch(error => console.error(error));

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
        imdbLinkElement.innerHTML = `<a href="${selectedMovie.link || '#'}" target="_blank">View on IMDb</a>`;
        document.querySelector(".movie-details").appendChild(imdbLinkElement);
    } else {
      console.error("No movie data found in localStorage");
    }
  });

  !async function(){
    let data = fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/upcoming-movies", requestOptions)
       .then((response) => response.text())
       .then((result) => {
          //console.log(result);
          displayMovies(result);
          return result;
       })
       .catch((error) => console.error(error));  
  }();
  
  function displayMovies(_data){
    //console.log(_data);
    let myData = JSON.parse(_data);
    console.log(myData);
  }

  fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/most-popular-movies", requestOptions)
  .then(response => response.json())
  .then(data => {
    if (data && data.movies) {
      // Call the function to populate the carousel with a random 5 movies
      populateCarousel(data.movies);
    } else {
      console.error("API response does not contain movie data.");
    }
  })
  .catch(error => console.error("Error fetching data:", error));
  
  function populateCarousel(movies) {
    const carouselInner = document.querySelector('#mainCarousel .carousel-inner');
    const carouselIndicators = document.querySelector('#mainCarousel .carousel-indicators');
    
    // Clear any existing slides and indicators
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';
  
    // Randomize the movies array and take only the first 5 movies
    const selectedMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 5);
  
    selectedMovies.forEach((movie, index) => {
      // Create a new carousel item
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (index === 0) carouselItem.classList.add('active'); // Make the first item active
  
      // Create the image element
      const img = document.createElement('img');
      img.src = movie.image || 'default-image.jpg'; // Fallback in case image is missing
      img.classList.add('d-block', 'w-100');
      img.alt = movie.title || 'Movie Image';
  
      // Append the image to the carousel item
      carouselItem.appendChild(img);
      carouselInner.appendChild(carouselItem);
  
      // Create a new indicator for each slide
      const indicator = document.createElement('button');
      indicator.type = "button";
      indicator.setAttribute('data-bs-target', '#mainCarousel');
      indicator.setAttribute('data-bs-slide-to', index);
      if (index === 0) indicator.classList.add('active'); // Set first indicator active
      carouselIndicators.appendChild(indicator);
    });
  }
  

