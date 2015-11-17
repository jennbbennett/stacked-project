$(document).ready(function() {
  console.log("ready!");

  // focus on input box on new user view
  var getStarted = $('.get-started-input');
  $('#text-name').focus();


  //hidden search div for new user view
  var searchInput = $('.search-input');
  $(searchInput).hide();

  var stackList = $('.stack-list');
  $(stackList).hide();

  //check local storage to see if these is an object there
  checkLocalStorage();
  //creating bookListObject in local storage
  function initializeLocalStorage(name, email, stackName) {
    var bookListObject = {
      name: name,
      email: email,
      bookLists: [{
        listName: stackName,
        books: [{
          title: "",
          author: "",
          thumbnail: "",
          ISBN: ""
        }, {
          title: "",
          author: "",
          thumbnail: "",
          ISBN: ''
        }]
      }],
    };

    localStorage.setItem('bookList', JSON.stringify(bookListObject));
  }

  function checkLocalStorage() {
    var object = localStorage.getItem('bookList');
    if (object === null) {
      $(getStarted).show();
      $(searchInput).hide();
    } else {
      initializeUserFromLocalStorage();
      $(getStarted).hide();
      $(searchInput).show();
    }
  }

  function initializeUserFromLocalStorage() {
    var bookListObject = JSON.parse(localStorage.getItem('bookList'));
    console.log(bookListObject);
    $('#welcome-name').text('Welcome back, ' + bookListObject.name + '!');
    $('#welcome-stack-name').text('Here is your "' + bookListObject.bookLists[0].listName + '" stack...');

  }


  function searchForBook(title, author, keyword) {
    var searchURL = 'https://www.googleapis.com/books/v1/volumes?q=';
    if( title !== undefined && title.length>0){
      searchURL = searchURL + 'intitle:' + encodeURI(title);
    }
    if( author !== undefined && author.length>0){
      searchURL = searchURL + 'inauthor:' + encodeURI(author);
    }
    if( keyword !== undefined && keyword.length>0){
      searchURL = searchURL + 'intitle:' + encodeURI(author);
    }
      // searchURL = searchURL + '+&maxResults=10&printType=books&projection=lite&startIndex=0&fields=items(volumeInfo(authors%2CimageLinks%2FsmallThumbnail%2CindustryIdentifiers%2Ctitle))%2CtotalItems&key=AIzaSyCe2EkbnxxEpkWIV5_1CSj2u2STSwrlKuo';
      searchURL = searchURL + '&printType=books&projection=lite&fields=items(volumeInfo(authors%2CimageLinks%2FsmallThumbnail%2CpublishedDate%2Ctitle))%2CtotalItems&key=AIzaSyCe2EkbnxxEpkWIV5_1CSj2u2STSwrlKuo';
    // $.get('https://www.googleapis.com/books/v1/volumes?q=intitle:' + encodeURI(title) + '+inauthor:' + encodeURI(author) + '+' + encodeURI(keyword) +
    $.get(searchURL,
      function(data) {
        console.log(data);
        var resultTable = $('#results-table');
        data.items.forEach(function(element) {
          var row = $(document.createElement('tr'));
          row.append($(document.createElement('td')).append($(document.createElement('img')).attr('src', element.volumeInfo.imageLinks.smallThumbnail)));
          row.append($(document.createElement('td')).text(element.volumeInfo.title));
          row.append($(document.createElement('td')).text(element.volumeInfo.authors));
          row.append($(document.createElement('td')).text(element.volumeInfo.publishedDate));
          resultTable.append(row);

        });
      });
    //need a callback function here
  }


  // button from first user view to create a new book list object
  $('#stackMe-button').click(function() {
    var myName = $('#text-name').val();
    console.log(myName);
    var myEmail = $('#text-email').val();
    console.log(myEmail);
    var myStackName = $('#text-stackName').val();
    console.log(myStackName);
    initializeLocalStorage(myName, myEmail, myStackName);
  });


  // button from search fields to generate API query
  $('#findMe-button').click(function() {
    var title = $('#title-search').val();
    console.log(title);
    var author = $('#author-search').val();
    console.log(author);
    var keyword = $('#keyword-search').val();
    console.log(keyword);
    searchForBook(title, author, keyword);
  });

  //clear search button
  $('#clearSearch-button').click(function() {
    $('#title-search').val('');
    $('#author-search').val('');
    $('#keyword-search').val('');
  });

});
