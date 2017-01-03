var img; // Declare variable 'img'.
var ChartBar; // Declare variable 'ChartBar'.
var noiseOff = 0;

var values = [];
var normalizedValues = [];

var AirData;

var realtimeData;
var realtimeSplitedData;
var realtimePulltuionData;

function preload() {

  img = loadImage("assets/OriginalPic_3200.jpg"); // Load the image   
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
var ptext = [];
var windowoffsetY;
var chartButton;
var showChart;
var hilightLiveData;
function setup() {
  //noiseDetail(0.01);
  canvas = createCanvas(3200, 500);
  thepainting = createImage(3200, 500);
  centerCanvas();
  windowoffsetY = int((windowHeight - img.height) * 0.4);
  for (var i = 1; i < 13; i++) {
    ptext[i] = createP('2016/' + i);
  }
  ChartBar = createImg("assets/ChartBar.png");
  showChart = false;
  hilightLiveData = false;
  //document.getElementById("HistoryData").onclick = function(){changeColor()};
  //chartButton.onclick = changeColor ;


  var bodyText = document.getElementById("DataText").innerHTML;

  //io socket to heroku-twitter-server
  socket = io.connect('http://heroku-twit-server.herokuapp.com');

  //Recive twitter data
  socket.on('twitData',
    // When we receive data
    function(data) {
      //console.log("Got: " + data);
      if (data == null) {
        realtimePulltuionData = 100;
      } else {
        realtimeData = data;
        //console.log(realtimeData);
        document.getElementById("DataText").innerHTML = realtimeData;
        realtimeSplitedData = split(realtimeData, ";");
        realtimePulltuionData = int(realtimeSplitedData[3]);
        //console.log(realtimePulltuionData);
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

var bgcolor = 0;


function showDiagram() {
  showChart = true;
}

function HilightData(){
  hilightLiveData = true;
}
function dimeliveData(){
  hilightLiveData = false;
  
}

function showImage() {
  showChart = false;
}

function windowResized() {
  centerCanvas();
  //resizeCanvas(windowWidth, windowWidth * 0.38);
}


var scrollCounter = 0;
var scrollSpeed = 1;
var displacement;
var nT = 0;
var offsetY;

function draw() {
  nT = nT + .001;
  scrollCounter += scrollSpeed;
  clear();


  //background(bgcolor);

  offsetY = int((height - img.height) * 0.4);

  stroke(180, 200);
  strokeWeight(2);

  windowoffsetY = int((windowHeight - img.height) * 0.4);
  
  if(hilightLiveData == true){
    document.getElementById("DataText").style.opacity = 1;
    document.getElementById("DataText").style.fontSize = "100%";
  }else{
    document.getElementById("DataText").style.opacity = 0.55;
     document.getElementById("DataText").style.fontSize = "80%";
  }
  
  
  if (showChart == true) {
    line(0, offsetY, width, offsetY);
    //line(width/2-920,20, width/2-920, 200);
    for (var i = 1; i < 13; i++) {
      ptext[i].position(-scrollCounter + img.width / 6 * (i - 1), windowoffsetY);
    }
    ChartBar.position(20, windowoffsetY + 48);
    ChartBar.size(350, 350);
    beginShape();
    noFill();
    stroke(255, 200);
    for (var i = 0; i < img.width; i++) {
      var maxDisplacement = realtimePulltuionData + realtimePulltuionData / 10 * noise(nT + i / 40);
      var actualIndex = scrollCounter + i;
      actualIndex = actualIndex % img.width;
      var normalizedValue = normalizedValues[actualIndex];
      displacement = int(normalizedValue * maxDisplacement) + offsetY;
      vertex(i, displacement + offsetY * 0.5);
    }
    endShape();
  } else {
    for (var i = 1; i < 13; i++) {
      ptext[i].position(-scrollCounter + img.width / 6 * (i - 1), windowoffsetY+100000);

    }
    ChartBar.position(20, windowoffsetY + 48);
    ChartBar.size(0, 0);
    for (var i = 0; i < img.width; i++) {
      var maxDisplacement = realtimePulltuionData * noise(nT + i / 40);
      var actualIndex = scrollCounter + i;
      actualIndex = actualIndex % img.width;
      var normalizedValue = normalizedValues[actualIndex];
      displacement = int(normalizedValue * maxDisplacement) + offsetY;
      copy(img, i, 0, 1, img.height, i, displacement, 1, img.height);
    }
  }

}