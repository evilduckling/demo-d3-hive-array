// Generate x terms of fibonacci sequense
/*function fibArray(n) {
  let ret = [];
  ret.push(4);
  ret.push(5);
  for(i = 2; i < n; i++) {
    let l = ret.length;
    ret.push((ret[l - 1] + ret[l - 2]) / 1.4);
  }
  return ret;
}
const datas = fibArray(17);*/

function mathArray(n) {
  let ret = [];
  for (i = 1; i < n; i++) {
    ret.push(1.2 + Math.cos(i / 100));
  }
  return ret;
}

const datas = mathArray(500);

const totWidth = 500;
const totHeight = 505;
const barPadding = 0;
const barWidth = Math.floor(totWidth / datas.length) - barPadding;

const maxOfArr = datas.reduce((acc, element) => Math.max(acc, element));

let svg = d3
  .select("svg")
  .attr("width", totWidth)
  .attr("height", totHeight);
/*
svg.append('rect')
  .attr('fill', '#D0FFFF')
  .attr('width', totWidth)  
  .attr('height', totHeight);
*/
svg
  .selectAll("rect")
  .data(datas)
  .enter()
  .append("rect")
  .attr("style", (d, i) => {
    let color = (i / datas.length) * 255;
    return "fill:rgb(0," + color + "," + color + ")";
  })
  .attr("y", d => totHeight - (d / maxOfArr) * totHeight + "px")
  .attr("x", (d, i) => i * (barWidth + barPadding) + "px")
  .attr("height", d => (d / maxOfArr) * totHeight + "px")
  .attr("width", barWidth);

svg
  .selectAll("text")
  .data(datas)
  .enter()
  .append("text")
  .text((d, i) => {
    if (i % 35 === 15) {
      return Math.round((d / maxOfArr) * 100) + " %";
    }
  })
  .attr("fill", "#0066AA")
  .attr("y", d => totHeight - (d / maxOfArr) * totHeight + 13 + "px")
  .attr("x", (d, i) => i * (barWidth + barPadding) + "px");
