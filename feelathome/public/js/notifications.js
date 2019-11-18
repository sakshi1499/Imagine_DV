$(document).ready(function(){

$('.removenotifications').click(function(e){
removenotification($(this))
})

$('#joinnotifiedroom').click(function(e){
  removenotification($(this))
  window.location.href='/'+$('.userId').attr('value')

})

})

function removenotification(req){
  var notification={notification: $('.notification').attr("value")}

  var url='/'+$('.userId').attr('value')+'/removenotification'

  $.ajax({
    method:"post",
    data:notification,
    url:url
  }).then(data=>{
window.location.href='/'+$('.userId').attr('value')
  })
}
