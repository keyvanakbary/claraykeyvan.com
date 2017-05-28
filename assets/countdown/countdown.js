var ProgressCanvas = function(canvas, attributes) {
  var context;

  function init() {
    context = canvas.getContext('2d');
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-Math.PI/2);
  }

  function clear() {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  function drawBackground() {
    context.beginPath();
    context.arc(0, 0, canvas.width / 2, 0, 2 * Math.PI, false);
    context.fillStyle = attributes.fill;
    context.fill();
  }

  function drawCircle(percentage) {
    context.beginPath();
    context.arc(0, 0, (canvas.width / 2) - attributes.border, 0, 2 * Math.PI * percentage, false);
    context.lineWidth = attributes.border * 2;
    context.strokeStyle = attributes.stroke;
    context.stroke();
  }

  function draw(percentage) {
    clear();
    drawBackground();
    drawCircle(percentage);
  }

  init();

  return {
    draw: draw
  }
}

var Counter = function(elem, config) {
  var REMAINING_ATTRIBUTE = 'data-remaining',
      progress,
      lastPercentage,
      number = selectRemainingElem();

  function selectRemainingElem() {
    var elems = elem.getElementsByTagName('*');
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].attributes[REMAINING_ATTRIBUTE]) {
        return elems[i];
      }
    }
    throw 'Remaining element not found';
  }

  function createCanvas(size) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = size * 2;//retina
    canvas.style.width = canvas.style.height = size + 'px';
    return canvas;
  }

  function init() {
    var canvas = createCanvas(config.size);
    elem.append(canvas);
    progress = ProgressCanvas(canvas, config);
    elem.style.width = config.size + 'px';
    elem.style.height = config.size + 'px';
  }

  function render(num, percentage) {
    if (percentage == lastPercentage) {
      return;//don't re-render on same value
    }
    progress.draw(percentage);
    number.innerHTML = num;
  }

  init();

  return {
    render: render
  }
};

var Countdown = function(elems, config) {
  var
    startDate = toDate(config.start),
    endDate = toDate(config.end),
    now = toDate(config.now),
    daysCounter = createCounter(elems.days),
    hoursCounter = createCounter(elems.hours),
    minutesCounter = createCounter(elems.minutes),
    secondsCounter = createCounter(elems.seconds),
    total = timeBuckets(endDate.getTime() - startDate.getTime());

  function createCounter(elem) {
    return Counter(elem, {
      border: config.border,
      fill: config.fill,
      stroke: config.stroke,
      size: config.size
    });
  }

  function timeBuckets(time) {
    var seconds = time / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;

    return {
      seconds: Math.floor(seconds % 60),
      minutes: Math.floor(minutes % 60),
      hours: Math.floor(hours % 24),
      days: Math.floor(days)
    }
  }

  function toDate(secs) {
      var date = new Date(1970, 0, 1);//epoch
      date.setSeconds(secs);
      return date;
  }

  function progress(remaining) {
    return {
      seconds: (60 - remaining.seconds) / 60,
      minutes: (60 - remaining.minutes) / 60,
      hours: (24 - remaining.hours) / 24,
      days: (total.days - remaining.days) / total.days,
    };
  }

  function render() {
    var remaining = timeBuckets(endDate.getTime() - now.getTime())

    var percentages = progress(remaining);
    daysCounter.render(remaining.days, percentages.days);
    hoursCounter.render(remaining.hours, percentages.hours);
    minutesCounter.render(remaining.minutes, percentages.minutes);
    secondsCounter.render(remaining.seconds, percentages.seconds);
  }

  render();
  setInterval(function () {
    render();
    now.setSeconds(now.getSeconds() + 1)
  }, 1000)
};
