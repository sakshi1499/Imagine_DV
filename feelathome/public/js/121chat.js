
$(document).ready(function() {
  $(".searchuser1").click(function(e){
    e.preventDefault();
directtochatroom($(this))
  })
})

function directtochatroom(users){
var option=$('#hidden').attr("value")
var username=$('.users').val()

  var room= `${username}.${option}`
  var x=Math.floor(Math.random()*room.length*1000)
  var updateUrl = '/chat?username=' + $('.users').val() +'&room='+room ;

  window.location.href=updateUrl
}
