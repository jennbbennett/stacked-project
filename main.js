$(document).ready(function() {
  console.log("ready!");

  // focus on input box on new user view
  var getStarted = $('.get-started-input');
  $('#text-name').focus();



  //hidden search div for new user view
  var searchInput = $('.search-input');
  $(searchInput).hide();


//Need to focus on title search box
//  var getSearching = $('.search-input');
//  $('#title-search').focus();

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
        books: [
          // {
        //   title: "",
        //   author: "",
        //   thumbnail: "",
        //   publicationDate: ""
        // }, {
        //   title: "",
        //   author: "",
        //   thumbnail: "",
        //   publicationDate: ''
        // }
      ]
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
      searchURL = searchURL + '&printType=books&projection=lite&fields=items(volumeInfo(authors%2CimageLinks%2FsmallThumbnail%2CpublishedDate%2Ctitle))%2CtotalItems&key=AIzaSyCe2EkbnxxEpkWIV5_1CSj2u2STSwrlKuo';
    // $.get('https://www.googleapis.com/books/v1/volumes?q=intitle:' + encodeURI(title) + '+inauthor:' + encodeURI(author) + '+' + encodeURI(keyword) +
    $.get(searchURL,
      function(data) {
        console.log(data);
        var resultTable = $('#results-table');
        data.items.forEach(function(book) {
          var row = $(document.createElement('tr'));
          row.append($(document.createElement('td')).append($(document.createElement('img')).attr('src', book.volumeInfo.imageLinks.smallThumbnail)));
          row.append($(document.createElement('td')).text(book.volumeInfo.title));
          row.append($(document.createElement('td')).text(book.volumeInfo.authors));
          row.append($(document.createElement('td')).text(book.volumeInfo.publishedDate));
          var bookInfo = {
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            publishedDate: book.volumeInfo.publishedDate,
            thumbnail: book.volumeInfo.imageLinks.smallThumbnail
          };
          console.log(bookInfo.authors);
          var $addButton = $('<button id="add">Add to Stack</button>');
          $addButton.on('click', function(){
            var stringObject = this.dataset.bookInfo;
            var bookObject = JSON.parse(stringObject);
            var bookListObject = JSON.parse(localStorage.getItem('bookList'));
            var bookList = bookListObject.bookLists[0];
            bookList.books.push(bookObject);
            console.log(bookListObject);
            localStorage.setItem('bookList', JSON.stringify(bookListObject));
            //get from local storage, iterate over bookList[0].books and append to new table
          //  var stack = JSON.parse(localStorage.getItem(bookList.bookLists.books));
          var stack = JSON.parse(localStorage.getItem('bookList'));
        //    console.log(stack.bookLists[0]);
            stack.bookLists[0].books.forEach(function(book){
              console.log(book);
              var stackTable = $('#stack-table');
              var row = $(document.createElement('tr'));
              row.append($(document.createElement('td')).append($(document.createElement('img')).attr('src', book.thumbnail)));
              row.append($(document.createElement('td')).text(book.title));
              row.append($(document.createElement('td')).text(book.authors));
              row.append($(document.createElement('td')).text(book.publishedDate));
              stackTable.append(row);
            });
            $(stackList).show();
          });
          $addButton.attr('data-book-info', JSON.stringify(bookInfo));
          row.append($addButton);
          console.log(bookInfo);
          resultTable.append(row);
        });
      });
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
