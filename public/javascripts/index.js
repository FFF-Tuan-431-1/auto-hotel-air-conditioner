$(document).ready(function() {
  $('#form').on('submit', function(e) {
    e.preventDefault();
    var isLogin = $('[name=isLogin]:checked').val() === 'login';

    // login or register url
    var url = isLogin ? '/api/login' : '/api/user';
    var from = $(this).serialize();

    var username = $('#username').val();
    var password = $('#password').val();

    $.ajax({
      url: url,
      method: 'post',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({username: username, password: password})
    }).then(function() {
      if (isLogin) {
        alert('登录成功');
        window.location.href = '/home';
      } else {
        alert('注册成功, 请登录');
      }
    }, function(body) {
      alert(body.responseJSON.error);
    });
  });
});