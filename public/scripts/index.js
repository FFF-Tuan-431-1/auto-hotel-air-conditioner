$('docuement').ready(function() {
  $('#loginBtn').on('click', function() {
    var password = $('#password').val();
    console.log(password);
    if (!password) {
      $('.ui.error.message').text('Password is empty!').addClass('visible');
      return;
    }

  })
});
