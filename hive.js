const graphWidth = 1000;
const graphHeight = 700;
const hostPerLine = 8;
const lineThickness = 10;
const hexaWidth = (graphWidth - 2 * lineThickness) / (hostPerLine + 0.5);
const halfHexaWidth = hexaWidth / 2;
const hexaRadius = hexaWidth / Math.sqrt(3);
const halfHexaRadius = hexaRadius / 2;
const vDedalsPerLine = hexaRadius + halfHexaRadius;
const animationDuration = 1000;

var hexaPath = (xOffset, yOffset) => {
  const path = d3.path();
  path.moveTo(0 + xOffset, halfHexaRadius + yOffset);
  path.lineTo(halfHexaWidth + xOffset, 0 + yOffset);
  path.lineTo(hexaWidth + xOffset, halfHexaRadius + yOffset);
  path.lineTo(hexaWidth + xOffset, hexaRadius + halfHexaRadius + yOffset);
  path.lineTo(halfHexaWidth + xOffset, hexaRadius * 2 + yOffset);
  path.lineTo(0 + xOffset, hexaRadius + halfHexaRadius + yOffset);
  path.closePath();
  return path;
};

const colorScale = d3
  .scaleLinear()
  .domain([0, 33, 66, 100])
  .range(["#6ED071", "#D09902", "#D45D01", "#A1292E"]);

const getXPosition = (d, i) => {
  let decal = 0;
  if (Math.floor(i / hostPerLine) % 2 === 1) {
    // Odd lines
    decal = halfHexaWidth;
  }
  return lineThickness + decal + (i % hostPerLine) * hexaWidth;
};

const getYPosition = (d, i) => {
  return lineThickness + Math.floor(i / hostPerLine) * vDedalsPerLine;
};

let svg = d3
  .select("svg")
  .attr("width", graphWidth)
  .attr("height", graphHeight);

function updateGraph() {
  if (!data) {
    return;
  }

  console.log(data);

  const hexas = svg.selectAll("path").data(data);
  const texts = svg.selectAll("text").data(data);

  const currentSize = hexas.size();

  // Update
  hexas.attr("fill", colorScale);
  texts.text(d => d + "%");

  hexas
    .enter()
    .append("path")
    .transition()
    .duration(animationDuration)
    .delay((d, i) => Math.max(0, i - currentSize) * 100)
    .attr("d", (d, i) => hexaPath(getXPosition(d, i), getYPosition(d, i)))
    .attr("stroke", "black")
    .attr("stroke-width", lineThickness)
    .attr("fill", colorScale)
    .attr("r", halfHexaWidth)
    .attr("x", getXPosition)
    .attr("y", getYPosition);

  texts
    .enter()
    .append("text")
    .transition()
    .delay((d, i) => Math.max(0, i - currentSize) * 100)
    .duration(animationDuration)
    .attr("x", (d, i) => {
      /*let decal;
      // Even lines
      if (Math.floor(i / hostPerLine) % 2 === 0) {
        decal = -10;
      } else {
        // Odd lines
        decal = halfHexaWidth - 10;
      }
      return decal + halfHexaWidth + (i % hostPerLine) * hexaWidth;*/
      return halfHexaWidth + getXPosition(d, i) - 10;
    })
    .attr("y", (d, i) => {
      // return halfHexaWidth + Math.floor(i / hostPerLine) * vDedalsPerLine + 3;
      return hexaRadius + getYPosition(d, i) + 3;
    })
    .text(d => d + "%")
    .attr("fill", "#FFFFFF")
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("font-family", "Lucida Grande");

  hexas
    .exit()
    .transition()
    .delay((d, i) => Math.max(0, i - currentSize) * 100)
    .duration(animationDuration)
    .remove();

  texts
    .exit()
    .transition()
    .delay((d, i) => Math.max(0, i - currentSize) * 100)
    .duration(animationDuration)
    .remove();
}

function evolveData() {
  if (!data) {
    return;
  }
  data.forEach((element, index) => {
    let v = Math.round(Math.random() * 20) - 10;
    data[index] = Math.min(Math.max(data[index] + v, 0), 100);
  });
}

let data = new Array(36).fill(10);

const looper = () => {
  updateGraph();
  evolveData();

  setTimeout(looper, 2000);
};

looper();
