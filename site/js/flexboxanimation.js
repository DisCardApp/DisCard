/*
window.addEventListener('load', function(event) {
  var targetClassName = 'flex-wrap-anim';
  var defaultDuration = '0.3s';

  var dummyList = [];
  function addDummy(item, duration) {
    var top = item.offsetTop;
    var left = item.offsetLeft;
    setTimeout(function() {
      item.style.position = 'absolute';
      item.style.top = top + 'px';
      item.style.left = left + 'px';

      var dummyDiv = document.createElement('div');
      dummyDiv.classList.add(targetClassName + '-dummy');
      var rect = item.getBoundingClientRect();
      dummyDiv.style.width = (rect.width + 50) + 'px';
      dummyDiv.style.height = (rect.height + 50) + 'px';
      dummyDiv.style.visibility = 'hidden';
      dummyDiv['__' + targetClassName + '_pair'] = item;
      dummyDiv['__' + targetClassName + '_duration'] = duration;
      item.parentNode.appendChild(dummyDiv);
      dummyList.push(dummyDiv);
    }, 0);
  }

  var conts = document.getElementsByClassName(targetClassName);
  for (var i = 0, max = conts.length; i < max; i++) {
    var cont = conts[i];
    cont.style.position = 'relative';
    var duration = cont.getAttribute('data-duration')
      || defaultDuration;
    var items = document.querySelectorAll('.flex-wrap-anim > div');
    for (var i = 0, max = items.length; i < max; i++) {
      addDummy(items[i], duration);
    }
  }

  window.addEventListener('resize', function(event) {
    dummyList.forEach(function(dummyDiv) {
      var item = dummyDiv['__' + targetClassName + '_pair'];
      var duration = dummyDiv['__' + targetClassName + '_duration'];
      if (item.offsetTop != dummyDiv.offsetTop) {
        item.style.transition = 'all ' + duration;
        item.style.top = dummyDiv.offsetTop + 'px';
        item.style.left = dummyDiv.offsetLeft + 'px';
      } else {
        item.style.transition = '';
        item.style.left = dummyDiv.offsetLeft + 'px';
      }
    });
  });
});
*/