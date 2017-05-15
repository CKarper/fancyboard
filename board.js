
const width = 16;
const height = 16;
const fadeStart = 60;
const fadeStop = 0;

let canvas;
let ctx;
let canvas_back;
let ctx_back;

const cells = new Array(width * height).fill().map((_, offset) => {
  const { x, y } = toCoords(offset);
  return { offset, x, y, r: 0, g: 0, b: 0, fadeStep: 0 }
});

let cellSize;
let xOffset;
let yOffset;

$(document).ready(() => {
  canvas = document.getElementById('fancyboard');
  canvas_back = document.createElement('canvas');
  calculateSizes();

  ctx = canvas.getContext('2d');
  ctx_back = canvas_back.getContext('2d');

  ctx.imageSmoothingEnabled = false;
  ctx_back.imageSmoothingEnabled = false;

  setInterval(() => setRandomCells(10), 100);
  setRandomCells(10);

  $(window).on('resize', calculateSizes);
  setTimeout(draw, 10);
  window.requestAnimationFrame(render);
});

function calculateSizes() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas_back.width = window.innerWidth;
  canvas_back.height = window.innerHeight;

  cellSize = Math.min(Math.floor(canvas.height / height), Math.floor(canvas.width / width));
  xOffset = Math.floor((canvas.width - (cellSize * width)) / 2);
  yOffset = Math.floor((canvas.height - (cellSize * height)) / 2);
}

function setRandomCells(howMany = 1) {
  new Array(howMany).fill().forEach(() => {
    const offset = getRandomArbitrary(0, cells.length);
    const color = getRandomArbitrary(0, 0xffffff);

    setCell(
      offset,
      {
        r: (color >> 16) & 255,
        g: (color >> 8) & 255,
        b: color & 255,
      }
    );
  });
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function toOffset(x, y) {
  return (y * width) + x;
}

function toCoords(offset) {
  const y = Math.floor(offset / width);
  const x = offset % width;
  return { x, y };
}

function setCell(offset, color) {
  cells[offset] = Object.assign(cells[offset], color, { fadeStep: fadeStart });
}

function draw() {
  cells
    .filter(({ fadeStep }) => fadeStep > fadeStop)
    .forEach((cell) => {
      const xDraw = xOffset + (cell.x * cellSize);
      const yDraw = yOffset + (cell.y * cellSize);

      ctx_back.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${cell.fadeStep / fadeStart})`;
      ctx_back.clearRect(xDraw, yDraw, cellSize, cellSize);
      ctx_back.fillRect(xDraw, yDraw, cellSize, cellSize);
      cell.fadeStep -= 1;
    });
  setTimeout(draw, 10);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvas_back, 0, 0);
  window.requestAnimationFrame(render);
}