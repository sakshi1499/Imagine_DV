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
