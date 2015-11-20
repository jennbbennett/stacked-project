$(document).ready(function() {
  console.log("ready!");

  // focus on input box on new user view
  var getStarted = $('.get-started-input');
  $('#text-name').focus();
  //hidden search div for new user view
  var searchInput = $('.search-input');
  $(searchInput).hide();

  //  Need to focus on title search box
  $('#title-search').focus();

  var resultsList = $('.results-list');
  $(resultsList).hide();

  var stackList = $('.stack-list');
  $(stackList).hide();

  var aboutInfo = $('.about-info');

  //check local storage to see if these is an object there
  checkLocalStorage();
  //creating bookListObject in local storage
  function initializeLocalStorage(name, email, stackName) {
    var bookListObject = {
      name: name,
      email: email,
      bookLists: [{
        listName: stackName,
        books: {}
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
      $(aboutInfo).hide();
      $('#title-search').focus();
      renderStack();
    }
  }

  function initializeUserFromLocalStorage() {
    var bookListObject = JSON.parse(localStorage.getItem('bookList'));
    console.log(bookListObject);
    $('#welcome-name').text('Welcome back, ' + bookListObject.name + '!');
    $('#welcome-stack-name').text('Here is your "' + bookListObject.bookLists[0].listName + '" Stack...');
    $('.stack-title').text(bookListObject.bookLists[0].listName);
  }
window.onresize = checkText;
  function checkText(){
    if (window.innerWidth < 1200 && window.innerWidth > 1000) {
      $('.remove-button').html('Remove');
      $('.read-button').html('Read');
      $('.unread-button').html('Unread');
      $('.add-button').html('Add');
    } else {
      $('.remove-button').html('Remove from Stack');
      $('.read-button').html('Mark as Read');
      $('.unread-button').html('Mark as Unread');
      $('.add-button').html('Add to Stack');
    }

  }

  function renderStack() {
    var stack = JSON.parse(localStorage.getItem('bookList'));
    var stackTable = $('#stack-table');
    stackTable.empty();
    var bookObj = stack.bookLists[0].books;
    Object.keys(bookObj).forEach(function(bookKey) {
      var book = bookObj[bookKey];
      var row = $(document.createElement('tr'));
      // trying something from 67-75
      var imgTd = $(document.createElement('td'));
      var thumbnailLink = '';
      if (book.thumbnail !== '') {
        thumbnailLink = book.thumbnail;
        console.log(thumbnailLink);
        imgTd.append($(document.createElement('img')).attr('src', thumbnailLink).addClass('image-thumbnail'));
      } else {
        imgTd.text('No Image Available');
      }
      row.append(imgTd);
      // row.append($(document.createElement('td')).append($(document.createElement('img')).attr('src', book.thumbnail).addClass('image-thumbnail')));
      row.append($(document.createElement('td')).text(book.title));
      row.append($(document.createElement('td')).text(book.authors));
      row.append($(document.createElement('td')).text(book.publishedDate));
      var buttonTd = $(document.createElement('td'));
      var $removeButton = $('<button id="remove" type="button" class="remove-button btn btn-default btn-xs btn-block">Remove from Stack</button>');
      // if (window.innerWidth < 1200 && window.innerWidth > 1000) {
      //   console.log('test');
      //   ($removeButton).html('Remove');
      // }
      // checkText($removeButton, 'remove');
      $removeButton.on('click', function() {
        var bookId = this.dataset.bookId;
        var bookListObject = JSON.parse(localStorage.getItem('bookList'));
        var bookList = bookListObject.bookLists[0];
        delete bookList.books[bookId];
        console.log(bookListObject);
        localStorage.setItem('bookList', JSON.stringify(bookListObject));
        renderStack();
      });
      $removeButton.attr('data-book-id', book.id);
      var $readButton = $('<button id="read" type="button" class="read-button btn btn-default btn-xs btn-block">Mark as Read</button>');
      var $unreadButton = $('<button id="unread" type="button" class="unread-button btn btn-default btn-xs btn-block">Mark as Unread</button>');
      $readButton.on('click', function() {
        row.css('background-color', '#C4BFB9');
        $readButton.hide();
        $unreadButton.show();
      });
      $unreadButton.on('click', function() {
        row.css('background-color', '#F3D7A7');
        $unreadButton.hide();
        $readButton.show();
      });
      buttonTd.append($removeButton);
      buttonTd.append($readButton);
      buttonTd.append($unreadButton);
      row.append(buttonTd);
      $unreadButton.hide();
      stackTable.append(row);
      row.css('background-color', '#F3D7A7');
    });
    $(stackList).show();
  }

  function searchForBook(title, author, keyword) {
    var searchURL = 'https://www.googleapis.com/books/v1/volumes?q=';
    if (title !== undefined && title.length > 0) {
      searchURL = searchURL + 'intitle:' + encodeURI(title);
    }
    if (author !== undefined && author.length > 0) {
      searchURL = searchURL + 'inauthor:' + encodeURI(author);
    }
    if (keyword !== undefined && keyword.length > 0) {
      searchURL = searchURL + keyword;
    }
    searchURL = searchURL + '&printType=books&projection=lite&fields=items(id%2CvolumeInfo(authors%2CimageLinks%2FsmallThumbnail%2CpublishedDate%2Ctitle))%2CtotalItems&key=AIzaSyCe2EkbnxxEpkWIV5_1CSj2u2STSwrlKuo';
    // $.get('https://www.googleapis.com/books/v1/volumes?q=intitle:' + encodeURI(title) + '+inauthor:' + encodeURI(author) + '+' + encodeURI(keyword) +
    $.get(searchURL,
      function(data) {
        var resultTable = $('#results-table');
        if (data.totalItems === 0) {
          alert('I am sorry, your search returned no results.  Would you like to try again?');
        }
        data.items.forEach(function(book) {
          var row = $(document.createElement('tr')).attr('id', 'addrow-id' + book.id);
          var imgTd = $(document.createElement('td'));
          var thumbnailLink = '';
          if (book.volumeInfo.imageLinks !== undefined && book.volumeInfo.imageLinks.smallThumbnail !== undefined) {
            thumbnailLink = book.volumeInfo.imageLinks.smallThumbnail;
            imgTd.append($(document.createElement('img')).attr('src', thumbnailLink).addClass('image-thumbnail'));
          } else {
            imgTd.text('No Image Available');
          }
          row.append(imgTd);
          row.append($(document.createElement('td')).text(book.volumeInfo.title));
          row.append($(document.createElement('td')).text(book.volumeInfo.authors));
          row.append($(document.createElement('td')).text(book.volumeInfo.publishedDate));
          var bookInfo = {
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            publishedDate: book.volumeInfo.publishedDate,
            thumbnail: thumbnailLink
          };
          var $addButton = $('<button id="add" type="button" class="add-button btn btn-default btn-xs btn-block">Add to Stack</button>');
          $addButton.on('click', function() {
            var stringObject = this.dataset.bookInfo;
            var bookObject = JSON.parse(stringObject);
            var bookListObject = JSON.parse(localStorage.getItem('bookList'));
            var bookList = bookListObject.bookLists[0];
            bookList.books[bookObject.id] = bookObject;
            console.log(bookListObject);
            localStorage.setItem('bookList', JSON.stringify(bookListObject));
            renderStack();
            var resultTable = $('#results-table');
            var thisRow = $('#addrow-id' + bookObject.id);
            thisRow.css("display", 'none');
          });
          $addButton.attr('data-book-info', JSON.stringify(bookInfo));
          row.append($(document.createElement('td')).append($addButton));
          resultTable.append(row);
        });
      });
  }



  // button from first user view to create a new book list object
  $('#stackMe-button').click(function(event) {
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
    var keyword = $('#keyword-search').val();
    if (title || author || keyword !== '') {
      searchForBook(title, author, keyword);
      $(searchInput).hide();
      $(resultsList).show();
    } else {
      alert('Please enter a search term in at least one field - thanks!');
    }
  });

  //clear search button
  $('#clearSearch-button').click(function() {
    $('#title-search').val('');
    $('#author-search').val('');
    $('#keyword-search').val('');
    var resultTable = $('#results-table');
    resultTable.empty();
    $(searchInput).show();
    $(resultsList).hide();
  });



});
