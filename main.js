$(document).ready(function() {
    console.log( "ready!" );

var getStarted = $('.get-started-input');
$('#text-name').focus();

// var searchInput = $('.search-input');
// $(searchInput).hide();



//$('.get-started-input').on(function(){
$('#stackMe-button').click(function() {
  var myName = $('#text-name').val();
  console.log(myName);
  var myEmail = $('#text-email').val();
  console.log(myEmail);
  var myStackName = $('#text-stackName').val();
  console.log(myStackName);

//$('.searchInput').on(function(){
$('#findMe-button').click(function(){
  var title = $('#title-search').val();
  console.log(title);
  var author = $('#author-search').val();
  console.log(author);
  var keyword = $('#keyword-search').val();
  console.log(keyword);

//clear search button
$('#clearSearch-button').click(function(){
  


//
//creating bookListObject in local storage

var bookListObject = {
  name: myName,
  email:  myEmail,
  bookLists: [{
    listName: "myStackName",
    books: [{
      title: "",
      author: "",
      thumbnail: "",
      ISBN: ""
    },{
      title: "",
      author: "",
      thumbnail: "",
      ISBN: ''
    }]
  }],
};

localStorage.setItem('bookList', JSON.stringify(bookListObject));
bookListObject = JSON.parse(localStorage.getItem('bookList'));
console.log(bookListObject);

});
});
});
