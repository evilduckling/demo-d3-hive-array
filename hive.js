var data;
const graphWidth = 800;
const graphHeight = 600;
const hostPerLine = 6;
const margin = 3;
const hostSize = graphWidth / (hostPerLine + 0.5) - margin;
const halfHostSize = hostSize / 2;
const vDedals = Math.sqrt(3 / 4) * (hostSize + margin); // Ah Ah !
const animationDuration = 1000;

const svg = d3
  .select("svg")
  .attr("width", graphWidth)
  .attr("height", graphHeight);

const colorScale = d3
  .scaleLinear()
  .domain([0, 33, 66, 100])
  .range(["#6ED071", "#D09902", "#D45D01", "#A1292E"]);

function updateGraph() {
  if (!data) {
    return;
  }

  console.log(data);

  let circles = svg.selectAll("circle").data(data);
  let texts = svg.selectAll("text").data(data);

  let currentSize = circles.size();

  // Update
  circles.attr("fill", d => colorScale(d));
  texts.text(d => d + "%");

  circles
    .enter()
    .append("circle")
    .transition()
    .duration(animationDuration)
    .delay((d, i) => Math.max(0, i - currentSize) * 100)
    .attr("r", halfHostSize)
    .attr("cx", (d, i) => {
      let decal;
      // Even lines
      if (Math.floor(i / hostPerLine) % 2 === 0) {
        decal = 0;
      } else {
        // Odd lines
        decal = halfHostSize;
      }
      return decal + halfHostSize + (i % hostPerLine) * (hostSize + margin);
    })
    .attr("cy", (d, i) => {
      return halfHostSize + Math.floor(i / hostPerLine) * vDedals;
    })
    .attr("fill", d => colorScale(d))
    .attr("stroke", "black");

  texts
    .enter()
    .append("text")
    .transition()
    .delay((d, i) => Math.max(0, i - currentSize) * 100)
    .duration(animationDuration)
    .attr("x", (d, i) => {
      let decal;
      // Even lines
      if (Math.floor(i / hostPerLine) % 2 === 0) {
        decal = -10;
      } else {
        // Odd lines
        decal = halfHostSize - 10;
      }
      return decal + halfHostSize + (i % hostPerLine) * (hostSize + margin);
    })
    .attr("y", (d, i) => {
      return halfHostSize + Math.floor(i / hostPerLine) * vDedals + 3;
    })
    .text(d => d + "%")
    .attr("fill", "#FFFFFF")
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("font-family", "Lucida Grande");

  circles
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

  let add = Math.round(Math.random() * 2);
  let addOrRemove = Math.round(Math.random());
  for (let i = 0; i < add; i++) {
    if (addOrRemove === 0) {
      data.pop();
    } else {
      data.push(Math.round(Math.random() * 100));
    }
  }
  data.forEach((element, index) => {
    let v = Math.round(Math.random() * 20) - 10;
    data[index] = Math.min(Math.max(data[index] + v, 0), 100);
  });
}

const looper = () => {
  evolveData();
  updateGraph();

  setTimeout(looper, 5000);
};

looper();
