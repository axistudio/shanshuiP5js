var img; // Declare variable 'img'.
var noiseOff = 0;

var values = [];
var normalizedValues = [];

var AirData;

var realtimeData;
var realtimeSplitedData;
var realtimePulltuionData;

function preload() {
  img = loadImage("assets/OriginalPic_small.jpg"); // Load the image   
  AirData = loadTable("assets/Beijing.csv", "csv", "header");

}
var listRowCount;
var canvas;
var thepainting;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);

  //canvas.size(windowWidth,windowWidth*0.38);
}

// Keep track of our socket connection
var socket;

function setup() {
  //noiseDetail(0.01);
  canvas = createCanvas(1920, 371 * 2);
  thepainting = createImage(1920, 371 * 2);
  centerCanvas();
  
  

  var bodyText = document.getElementById("DataText").innerHTML;

  //io socket to heroku-twitter-server
  socket = io.connect('http://heroku-twit-server.herokuapp.com');
  
  //Recive twitter data
  socket.on('twitData',
    // When we receive data
    function(data) {
      //console.log("Got: " + data);
      if(data == null){
        realtimePulltuionData = 100;
      }
      else{
      realtimeData = data;
      console.log(realtimeData);
      document.getElementById("DataText").innerHTML = realtimeData;
      realtimeSplitedData = split(realtimeData,";");
      realtimePulltuionData = int(realtimeSplitedData[3]);
      console.log(realtimePulltuionData);
      }
    }
  );
  
  
  
  //canvas.position(0,0);
  canvas.parent("bg");
  listRowCount = AirData.getRowCount() - 3;
  var maxVal = 0;
  for (var i = 3; i < AirData.getRowCount(); i++) {
    for (var j = 0; j < AirData.getColumnCount(); j++) {
      //values[i] = int(AirData.getString(i,7));
      //print(values[i]);
      var val = int(AirData.getString(i, 7));
      if (val < 0) val = 0;
      values[i] = val;
      if (val > maxVal) maxVal = val;
    }
  }
  for (var i = 0; i < values.length; i++) {
    var val = values[i];
    normalizedValues[i] = val / maxVal;
  }
}

function windowResized() {
  centerCanvas();
  //resizeCanvas(windowWidth, windowWidth * 0.38);
}

var scrollCounter = 0;
var scrollSpeed = 1;
var displacement;
var nT = 0;

function draw() {
  nT = nT + .01;
  scrollCounter += scrollSpeed;
  clear();


  //background(0);
  var offsetY = int((height - img.height) * 0.4);
  for (var i = 0; i < img.width; i++) {
    var maxDisplacement = realtimePulltuionData * noise(nT + i / 4) * noise(nT);
    var actualIndex = scrollCounter + i;
    actualIndex = actualIndex % img.width;
    var normalizedValue = normalizedValues[actualIndex];
    displacement = int(normalizedValue * maxDisplacement) + offsetY;
    copy(img, i, 0, 1, img.height, i, displacement, 1, img.height);
  }

}