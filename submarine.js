var width = d3.select("body").node().getBoundingClientRect().width,
height = d3.select("body").node().getBoundingClientRect().height;

var svg = d3.select("body").append("svg")
.attr("height", "100%")
.attr("width", "100%");

//Creazione sottomarino
var submarine = {
  x: width/2,
  y: height - 200
}

var imageSub = svg.selectAll("image").data([0]);
imageSub.enter()
.append("image")
.attr("xlink:href", "submarine.png")
.attr("x", submarine.x)
.attr("y", submarine.y)
.attr("width", "200")
.attr("height", "200")
.transition()
.on("start", createBubble);

function createBubble(){
  var bubble = {
    x: d3.randomUniform(50, 150)(),
    y: d3.randomUniform(5, 20)(),
    r: d3.randomUniform(5, 20)()
  }

  //creazuione Radial Gradient della bolla
  var gradientID = "gradient" + Date.now();
  var defs = svg.append("defs");
  defs.append("radialGradient")
  .attr("id", gradientID)
  .selectAll("stop")
  .data([
    {offset: "0%", color: "white"},
    {offset: "50%", color: "#86e9e4"},
    {offset: "90%", color: "#86e9e4"},
    {offset: "100%", color: "white"}
  ])
  .enter().append("stop")
  .attr("offset", function(d) { return d.offset; })
  .attr("stop-color", function(d) { return d.color; });

  //Random Radial Gradient per ogni bolla 
  //(in modo tale che sia su una circonferenza poco più piccola del raggio della bolla)
  var focalX = d3.randomUniform(0.2, 0.8)();
  var value1 = (1 - Math.sqrt(4*(Math.pow(0.4,2))-4*(Math.pow(focalX,2))+4*focalX-1)) /2;
  var value2 = (1 + Math.sqrt(4*(Math.pow(0.4,2))-4*(Math.pow(focalX,2))+4*focalX-1)) /2;
  var focalY = Math.random() < 0.5 ? value1 : value2;
  svg.select("#" + gradientID + "")
  .attr("fx", focalX)
  .attr("fy", focalY);

  //Creazione di una bolla
  var imageBubble = svg.append("circle")
  .attr('r', bubble.r)
  .attr('cx',  submarine.x + bubble.x)
  .attr('cy',  submarine.y - bubble.y)
  .style("opacity", 0.7)
  .style("fill", "url(#" + gradientID + ")");

  imageBubble.on("click", function(){
    imageBubble.transition()
    .duration(100)
    .ease(d3.easeCubicIn)
    .attr("r", bubble.r*2.3)
    .attr("stroke-opacity", 0)
    .on("end", removeDefs)
    .remove();
  })

  imageBubble.transition()
  .duration(10000)
  .ease(d3.easeLinear)
  .attr("cy", -bubble.r * 2.3)
  .attr("r", bubble.r * 2.3)
  .on("end", removeDefs)
  .remove();

  function removeDefs(){
    defs.transition().remove();
  }
}

setInterval(createBubble, 800);

//funzione per muovere il sottomarino
d3.select(window).on("keydown", function() {
  switch (d3.event.keyCode) {
    //verso sinistra
    case 37: {
      svg.selectAll("image").data([0]).attr("x", function(d){
        if(submarine.x < -200){
          submarine.x = width;
        }else{
          submarine.x -= 6;
        }
        return submarine.x
      });
      break
    }
    //verso destra
    case 39: {svg.selectAll("image").data([0]).attr("x", function(d){
      if(submarine.x > width - 200){
        submarine.x;
      }else{
        submarine.x += 6;
      }
      return submarine.x
    });break}
  }
});

//Ridisegna il sottomarino ogni volta che c'è un resize della pagina
window.addEventListener("resize", resize);
function resize(){
  var newWidth = d3.select("body").node().getBoundingClientRect().width;
  height = d3.select("body").node().getBoundingClientRect().height;


var scaleWidth = d3.scaleLinear();
scaleWidth.domain([0, width])
scaleWidth.range([0, newWidth]); 

  submarine.x = scaleWidth(submarine.x);
  submarine.y = height - 200;

  // Redraw submarine
  var image = svg.selectAll("image").data([0]);
  image
  .attr("x", submarine.x)
  .attr("y", submarine.y);

  width = newWidth;
}
