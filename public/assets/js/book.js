$(document).ready(function() {



    $.ajax({
        type: 'GET',
        url: '/xXEmilioXx/MyBookstore/1.0.0/book/' + getURLQueryParameter(),
        datatype: 'json',
        success: function (response) {
            adjustBookPage(response);
        }
    });



    function createGenresList(genresArray) {
        var i = 0;
        var nGenres = genresArray.length;

        if (nGenres != 0) {
            $("#genreList").append('<p>');
            for (i; i < nGenres - 1; i++) {
                $("#genreList").append(genresArray[i] + ', ');
            }
            $("#genreList").append(genresArray[i]);
            $("#genreList").append('</p>');
        }
        else $("#genreList").append('<p>This book has no genres</p>');
    }


    function createThemesList(themesArray) {
        var i = 0;
        var nThemes = themesArray.length;

        if (nThemes!=0) {
            $("#themeList").append('<p>');
            for (i; i < nThemes - 1; i++) {
                $("#themeList").append(themesArray[i] + ', ');
            }
            $("#themeList").append(themesArray[i]);
            $("#themeList").append('</p>');
        }
        else $("#themeList").append('<p>This book has no particular themes</p>');
    }

    function createSimilarBookList(similarBooksArray) {
        const maxBooks = 3;
        var i = 0;
        var r;
        var nSimilarBooks = similarBooksArray.length;
        if (nSimilarBooks !=0) {
            var randomSimilarBooksArray = [];

            for (i; ((i < maxBooks) && (i < nSimilarBooks)); i++) {
                r = Math.floor(Math.random() * (nSimilarBooks - i));
                randomSimilarBooksArray.push(similarBooksArray[r]);

                for (var j = 0; j < nSimilarBooks; j++) {
                    if (j === r) {
                        similarBooksArray.splice(j, 1);
                    }
                }

            }

            var nRandomSimilarBooks = randomSimilarBooksArray.length;

            $("#similarBooksList").append('<div class="card-deck">');
            for (i = 0; i < nRandomSimilarBooks; i++) {
                $("#similarBooksList").append('<div class="card">\n' +
                    '    <img src="'+ randomSimilarBooksArray[i].image_path +'" class="card-img-top" alt="Book Image">\n' +
                    '    <div class="card-body">\n' +
                    '      <h5 class="card-title">' + '<a class="similarBookLink" href="book.html?parameter='+ randomSimilarBooksArray[i].bookID + '">' + randomSimilarBooksArray[i].name +'</a></h5>\n' +
                    '    </div>\n' +
                    '  </div>');
                //$("#similarBooksList").append('<a href="book.html?parameter=' + randomSimilarBooksArray[i].bookID + '" class="list-group-item list-group-item-action">' + randomSimilarBooksArray[i].name + '</a>');
            }
            $("#similarBooksList").append('</div>');
        }
        else $("#similarBooksList").append('<p>This book has no similar Books</p>');
    }

    function createAuthorList(authorArray) {
        var i = 0;
        var nAuthors = authorArray.length;

        if (nAuthors!=0) {
            for (i; i < nAuthors - 1; i++) {
                $("#authorList").append('<a href="author.html?parameter=' + authorArray[i].authorID + '">' + authorArray[i].firstName + ' ' + authorArray[i].lastName + '</a>' + ', ');
            }
            $("#authorList").append('<a href="author.html?parameter=' + authorArray[i].authorID + '">' + authorArray[i].firstName + ' ' + authorArray[i].lastName + '</a>');
        }
        else $("#authorList").append('<p>No authors for this book</p>');
    }

    function createEventList (eventArray){
        var i = 0;
        var nEvents = eventArray.length;
        if (nEvents!=0) {
            for (i; i < nEvents - 1; i++) {
                $("#eventList").append('<a href="event.html?parameter=' + eventArray[i].eventID + '">' + eventArray[i].name + '</a>' + ', ');
            }
            $("#eventList").append('<a href="event.html?parameter=' + eventArray[i].eventID + '">' + eventArray[i].name + '</a>');
        }
        else $("#eventList").append('<p>No events associated with this book</p>');

    }

    function createReviewList (reviewArray){
        var i = 0;
        var nReviews = reviewArray.length;
        if (nReviews!=0) {
            $("#reviewList").append('</p><hr class="featurette-divider">');
            for (i; i < nReviews - 1; i++) {
                $("#reviewList").append('<h3 class="reviewTitle">' + reviewArray[i].reviewer + '</h3><p class="reviewBody">' + reviewArray[i].review + '</p><hr class="featurette-divider">');
            }
        }
        else $("#reviewList").append('<p>No reviews of this book present</p>');

    }


    function adjustBookPage(bookjson) {
        var book = JSON.parse(JSON.stringify(bookjson));

        if (book[0].image_path===undefined)
            $(".card-img").attr("src", "../img/noImagePlaceholder.jpg");
        else
            $(".card-img").attr("src", book[0].image_path);

        if (book[0].name===undefined)
            document.getElementById("name").innerHTML = "Name not found";
        else
            document.getElementById("name").innerHTML = book[0].name;

        if (book[0].edition===undefined)
            document.getElementById("edition").innerHTML = "Edition not found";
        else
            document.getElementById("edition").innerHTML = book[0].edition;

        if (book[0].cost===undefined)
            document.getElementById("cost").innerHTML = "Cost not found";
        else
            document.getElementById("cost").innerHTML = book[0].cost + " €";

        if (book[0].abstract===undefined)
            document.getElementById("abstract").innerHTML = "Abstract not found";
        else
            document.getElementById("abstract").innerHTML = book[0].abstract;

        if (!(book[0].authorInterview===null))
            $("#authorInterview").append('<h1 class="display-4"> Author Interview </h1><p class="authorInterview">'+ book[0].authorInterview +'</p>');

        createReviewList(book[0].reviews);
        createAuthorList(book[0].authors);
        createGenresList(book[0].genres);
        createThemesList(book[0].themes);
        createEventList(book[0].events);
        createSimilarBookList(book[0].similarBooks);
    }

    function noticePurchase(){
        // Add the "show" class to div
        $("#orderSuccess").addClass("show");

        // After 3 seconds, remove the show class from div
        setTimeout(function(){ $("#orderSuccess").removeClass("show"); }, 2000);
    }

    $('form').on('click', '#pressBuyBookButton', function () {

        // in case the user has not logged-in, the order is avoided and instead the user is directed toward the "Log-in" or "Registration" pages through a modal
        if (window.localStorage.getItem("accessToken") === null){
            $("#noAccount").modal('show');
            return;
        }

        const quantity = $('#formControlSelect.form-control').children("option:selected").val();
        const id = getURLQueryParameter();
        const returnObject = {bookID: parseInt(id), copies: parseInt(quantity)};
        const returnJSON = JSON.stringify(returnObject);

        $.ajax({
            type: "POST",
            url: "/xXEmilioXx/MyBookstore/1.0.0/user/cart/addBook",
            data: returnJSON,
            contentType: "application/json",
            headers : {'x-auth-token' : window.localStorage.getItem("accessToken")},
            success: function () {
                noticePurchase();
            }
        });
    });

});


