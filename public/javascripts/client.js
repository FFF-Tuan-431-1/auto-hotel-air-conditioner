$(document).ready(function() {
  $('#link-edit').click(function(e) {
    e.preventDefault();
    var newName = window.prompt('请输入新的主机名');
    if (!newName) {
      return ;
    }
    $.ajax({
      url: '/api/client/' + $('#link-edit').data('id'),
      data: JSON.stringify({name: newName}),
      method: 'put',
      contentType: "application/json; charset=utf-8",
    }).then(function() {
      window.location = window.location;
    });
  });

  $('#link-delete').click(function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/client/' + $('#link-delete').data('id'),
      method: 'delete',
    }).then(function() {
      window.location.href = '/home';
    });
  });

  $('#btn-ping').click(function(e) {
    e.preventDefault();
    var $btn = $(this);
    $btn.html($('<span>加载中 <i class="fa fa-spinner faa-spin animated"></i></span>'));
    $('.placeholder').text('').removeClass('success error');
    $.ajax('/api/client/' + $('#link-edit').data('id') + '/ping')
      .then(function(body) {
        setTimeout(function() {
          $btn.text('发送 ping 包');
          $('.placeholder').text('ping 成功, 时间为 ' + body.time + 'ms').addClass('success');
        }, 500);
    }, function(res) {
      $btn.text('发送 ping 包');
        $('.placeholder').text('ping 失败, 错误为: ' + res.responseJSON.error.message).addClass('error');
    })
  });

  var url = '/api' + window.location.pathname + '/state';
  $.ajax(url).then(function(data) {
    var data = data.map(function(item) {
      return {
        date: new Date(item.time),
        name: item.state
      };
    });

    var formatDate = d3.time.format('%d日%H:%M' );

    var options =   {
      margin: {left: 20, right: 20, top: 20, bottom: 20},
      initialWidth: 800,
      initialHeight: 300
    };

    var innerWidth =  options.initialWidth - options.margin.left - options.margin.right;
    var innerHeight = options.initialHeight - options.margin.top - options.margin.bottom;
    var colorScale = d3.scale.category10();

    var vis = d3.select('#timeline')
      .append('svg')
      .attr('width',  options.initialWidth)
      .attr('height', options.initialHeight)
      .append('g')
      .attr('transform', 'translate('+(options.margin.left)+','+(options.margin.top)+')');

    function labelText(d){
      return formatDate(d.date) + ' - ' + d.name;
    }

    var dummyText = vis.append('text');

    var timeScale = d3.time.scale()
      .domain(d3.extent(data, function(d){return d.date;}))
      .range([0, innerWidth])
      .nice();

    var nodes = data.map(function(movie){
      var bbox = dummyText.text(labelText(movie))[0][0].getBBox();
      movie.h = bbox.height;
      movie.w = bbox.width;
      return new labella.Node(timeScale(movie.date), movie.w + 9, movie);
    });

    dummyText.remove();

// ---------------------------------------------------
// Draw dots on the timeline
// ---------------------------------------------------

    vis.append('line')
      .classed('timeline', true)
      .attr('x2', innerWidth);

    var linkLayer = vis.append('g');
    var labelLayer = vis.append('g');
    var dotLayer = vis.append('g');

    dotLayer.selectAll('circle.dot')
      .data(nodes)
      .enter().append('circle')
      .classed('dot', true)
      .attr('r', 3)
      .attr('cx', function(d){return d.getRoot().idealPos;});

    function color(d,i){
      return '#888';
    }

//---------------------------------------------------
// Labella has utility to help rendering
//---------------------------------------------------

    var renderer = new labella.Renderer({
      layerGap: 60,
      nodeHeight: nodes[0].data.h,
      direction: 'bottom'
    });

    function draw(nodes){
      // Add x,y,dx,dy to node
      renderer.layout(nodes);

      // Draw label rectangles
      var sEnter = labelLayer.selectAll('rect.flag')
        .data(nodes)
        .enter().append('g')
        .attr('transform', function(d){return 'translate('+(d.x-d.width/2)+','+(d.y)+')';});

      sEnter
        .append('rect')
        .classed('flag', true)
        .attr('width', function(d){ return d.data.w + 9; })
        .attr('height', function(d){ return d.data.h + 4; })
        .attr('rx', 2)
        .attr('ry', 2)
        .style('fill', color);

      sEnter.append('text')
        .attr('x', 4)
        .attr('y', 15)
        .style('fill', '#fff')
        .text(function(d){return labelText(d.data);});

      // Draw path from point on the timeline to the label rectangle
      linkLayer.selectAll('path.link')
        .data(nodes)
        .enter().append('path')
        .classed('link', true)
        .attr('d', function(d){return renderer.generatePath(d);})
        .style('stroke', color)
        .style('stroke-width',2)
        .style('opacity', 0.6)
        .style('fill', 'none');
    }

//---------------------------------------------------
// Use labella.Force to place the labels
//---------------------------------------------------

    var force = new labella.Force({
      minPos: -10,
      maxPos: innerWidth
    })
      .nodes(nodes)
      .on('end', function(){
        draw(force.nodes());
      })
      .start(100);
  });
});