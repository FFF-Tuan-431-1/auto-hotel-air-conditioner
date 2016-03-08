$(document).ready(function() {
  var _onlineTpl = $('<td class="online">在线</td>');
  var _offlineTpl = $('<td class="offline">离线</td>');
  var actions = function(client) {
    return $('<td>').append(
      $('<a>').attr('href', 'client/' + client.id).append($('<span><i class="fa fa-info-circle"></i> 详情</span>'))
    )
  };
  const app = {
    init: function() {
      this.$table = $('#clients-table');
      this.$loading = $('#loading');

      this.load();
      this.bind();
    },

    load: function() {
      app.$loading.show();
      $.ajax('/api/client')
        .then(function(clients) {
          app.$table.find('tbody').html('');

          clients.forEach(function(client) {
            var tr = $('<tr>').append(
              $('<td>').text(client.id),
              $('<td>').text(client.name),
              $('<td>').text(client.mac),
              client.isOnline ? _onlineTpl.clone() : _offlineTpl.clone(),
              actions(client)
            );
            app.$table.find('tbody').append(tr);
          });
          app.$loading.hide();
        });
    },
    bind() {
      $('#form-creation').submit(function(e) {
        e.preventDefault();
        var $btn = $('#btn-create');
        $btn.html($('<span>加载中 <i class="fa fa-spinner faa-spin animated"></i></span>'));
        var temp = /[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}/;
        if (!temp.test($('#client-mac').val())) {
          $btn.text('添加主机');
          alert('请输入合法的mac地址!');
          return false;
        }

        $.ajax({
          url: '/api/client',
          data: JSON.stringify({mac: $('#client-mac').val(), name:$('#client-name').val()}),
          method: 'post',
          contentType: "application/json; charset=utf-8"
        }).then(function(){
          $btn.text('添加主机');
          alert("添加成功！");
          window.location.href = '/home';
        }, function() {
          $btn.text('添加主机');
          alert('添加失败, 主机名或 Mac 地址已存在');
        })
      });
    }
  };

  app.init();
});