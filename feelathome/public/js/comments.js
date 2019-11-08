$(document).ready(function() {
  var default_color = $(".chars-counter").css("color");

  $("#comment-input").on('keydown keyup', function() {
    var comment_len = $(this).val().length;

    $("#chars-current").html(comment_len);

    if(comment_len == 60)
      $(".chars-counter").css("color", "red");

    if(comment_len < 60 && $('.chars-counter').css("color") != default_color)
      $(".chars-counter").css("color", default_color);
  });
  $('.likescount').click( function(){
updatelikes($(this));

  })

  $('.bm').click( function(){
// if($(this).css("color")==="rgb(0, 0, 0)")
// {$(this).css("color","gold")
// }
// else
//   {$(this).css("color","black")
// }
updatebookmarks($(this));

  })





});

function updatelikes(like){

  // console.log($('#likesnumber').text());
  // console.log(JSON.stringify(like.attr('id')));
  var updateUrl = '/' + like.attr('id') +'/likes';

  $.ajax({
    method: 'GET',
    url:  '/posts/' + like.attr('id') })
  .then(function(data){
    var count=data.likesCount
    // console.log(count);

  var updateData = {likesCount:+count+1 }
$('.likesnumber'+like.attr('id')).text(+count+1)
  $.ajax({
    method: 'PUT',
    url: updateUrl,
    data: updateData
  })
  .then(function(data){
    // console.log(JSON.stringify(data.likesCount));
    // $('.likesnumber').text(+count+1)

  })
})

}

function updatebookmarks(like){

  // console.log($('#likesnumber').text());
  // console.log(JSON.stringify(like.attr('id')));
  var updateUrl = '/' + like.attr('value')+'/bookmarks/'+ like.attr('id') ;

console.log('localhost:3000'+updateUrl);
  $.ajax({
    method: 'GET',
    url: updateUrl })
  .then(function(data){
    var bookmarked=data.bookmarked
    // console.log(count);
    var color= !bookmarked ?"gold":"black" ;
    $('.bookmark' +like.attr('id')).css("color",color)
  var updateData = {bookmarked:!bookmarked }
  $.ajax({
    method: 'PUT',
    url: updateUrl,
    data: updateData
  })
  .then(function(data){
    // console.log(JSON.stringify(data.bookmarked));
    // $('.likesnumber').text(+count+1)


  })
})

}
