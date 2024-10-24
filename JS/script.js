// Look at console
$(document).ready(function() {
    var loginUsername;
    var loginPassword;
    var account = [loginUsername, loginPassword];
    
    $('#login-button').on('click', function() {
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
    
    $('#create-button').on('click', function() {
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
     
      if(!validate.test(createUsernameEntry) || (createUsernameEntry).length == 0) {
        $(createUsernameObject).addClass("error")
        $(createUsernameObject).val("No special characters or spaces.")
      } else {
        createUsernameValid = true;
        var createUsername = $(createUsernameObject).val();
      }
      
      if(!validate.test(createPasswordEntry) || (createPasswordEntry).length == 0) {
        $(createPasswordObject).addClass("error");
        $(createPasswordObject).val("No special characters or spaces.");
      } else {
        createPasswordValid = true;
        var createPassword = $(createPasswordObject).val();
      }
      
      if(!validateEmail.test(createEmailEntry)) {
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
      
      if(createUsernameValid == true && createPasswordValid == true && createEmailValid == true) {
        $('form').animate({
        height: "toggle",
        opacity: "toggle"
      }, "fast");
      }
    });
    
    $('.message a').on('click', function() {
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


fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=action", requestOptions)
.then(res => res.json())
.then(data => {
    if (data && data.movies) {
        const carouselInner = document.querySelector('.carousel-inner');
        // Clear existing items if any
        carouselInner.innerHTML = '';

        data.movies.forEach((movie, index) => {
            const activeClass = index === 0 ? 'active' : '';
            
            const carouselItem = `
            <div class="carousel-item ${activeClass}">
                <img
                    src="${movie.image}"
                    width="348px"
                    height="209px"
                    style="object-fit: fit"
                    class="rounded-lg"
                />
                <div class="position-absolute">
                    ${index + 1}
                </div>
                <div class="position-absolute">
                    <p>${movie.title}</p>
                    <div>
                        <p>${movie.year} / ${movie.genre}</p>
                        <p>IMDB ${movie.rating}</p>
                    </div>
                </div>
            </div>`;
            carouselInner.insertAdjacentHTML('beforeend', carouselItem);
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
           data.movies.forEach(movie => {
            const markup = `
            <div style="display: inline-block; margin-right: 10px;">
                <img src="${movie.image}" alt="${movie.title}" style="width: 100px; height: 150px; object-fit: cover;" />
                <span>${movie.title}</span>
            </div>`;
               document.querySelector('#movie-continue').insertAdjacentHTML('beforeend', markup);
           });
       } else {
           console.error("API response does not contain an array of movies.");
       }
   })
   .catch(error => console.error(error));

   fetch("https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/get-by-genre?genre=comedy", requestOptions)
   .then(res => res.json())
   .then(data => {
       if (data && data.movies) {
           data.movies.forEach(movie => {
            const markup = `
            <div style="display: inline-block; margin-right: 10px;">
                <img src="${movie.image}" alt="${movie.title}" style="width: 100px; height: 150px; object-fit: cover;" />
                <span>${movie.title}</span>
            </div>`;
               document.querySelector('#movie-discovery').insertAdjacentHTML('beforeend', markup);
           });
       } else {
           console.error("API response does not contain an array of movies.");
       }
   })
   .catch(error => console.error(error));
