var book_id = window.location.href.split("/").pop();
var canvas = document.getElementById("canvas1");
var undo = document.getElementById("undo");
const p = document.getElementById("text");
const pg = document.getElementById("pg");
const gp = document.getElementById("go_page");
const c_n = document.getElementById("count");
const pr = document.getElementById("previous");
const nx = document.getElementById("next");
const green = document.getElementById("green");
const yellow = document.getElementById("yellow");
const blue = document.getElementById("blue");
const red = document.getElementById("red");
var ctx = canvas.getContext("2d");

var xx = window.innerWidth * 0.8;
var yy = window.innerWidth * 1.414 * 0.8;
canvas.width = xx;
canvas.height = yy;

var img = new Image();

var mouseX;
var mouseY;
var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;
var isMouseDown = false;
var brushSize = 5;
var brushColor = "#198754";
ctx.lineJoin = "round";
var undostack = [];

function savestate() {
  undostack.push(canvas.toDataURL());
}

function handleMouseDown() {
  savestate();
  ctx.beginPath();
  isMouseDown = true;
}

function handleMouseUp() {
  isMouseDown = false;
}

function handleMouseMove(e) {
  console.log(undostack[undostack.length - 1]);

  mouseX = e.offsetX;
  mouseY = e.offsetY;

  if (isMouseDown) {
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
  }
}

function und() {
  if (undostack.length > 0) {
    img.src = undostack[undostack.length - 1];
    undostack.pop();
  }
}

canvas.addEventListener("mousedown", () => {
  handleMouseDown();
});
canvas.addEventListener("mousemove", (e) => {
  handleMouseMove(e);
});
canvas.addEventListener("mouseup", () => {
  handleMouseUp();
});
canvas.addEventListener("mouseout", () => {
  handleMouseUp();
});

undo.addEventListener("mousedown", () => {
  und();
});

function show_page(page) {
  undostack = [];
  pg.style.backgroundColor = "white";
  fetch(`/pages?q=${page}&b=${book_id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.page < data.length) {
        nx.style.visibility = "visible";
      } else if (data.page >= data.length) {
        nx.style.visibility = "hidden";
      }

      if (data.page > 1) {
        pr.style.visibility = "visible";
      } else if (data.page <= 1) {
        pr.style.visibility = "hidden";
      }

      gp.setAttribute("max", data.length);
      fetch(data.text)
        .then((res) => res.text())
        .then((text) => {
          p.textContent = text;
        })

        .catch((e) => console.error(e));
      setTimeout(() => {
        gp.value = data.page;
        c_n.innerHTML = data.length;
        timestamp = new Date().getTime();
        img.src = data.image + "?_=" + timestamp;

        img.onload = function () {
          ctx.drawImage(img, 0, 0, xx, yy);
        };
      }, 10);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  green.addEventListener("click", () => {
    brushColor = "#198754";
    green.setAttribute("class", "btn btn-secondary");
    yellow.setAttribute("class", "btn btn-outline-success");
    blue.setAttribute("class", "btn btn-outline-success");
    red.setAttribute("class", "btn btn-outline-success");
  });

  yellow.addEventListener("click", () => {
    brushColor = "FFFF00";
    yellow.setAttribute("class", "btn btn-secondary");
    green.setAttribute("class", "btn btn-outline-success");
    blue.setAttribute("class", "btn btn-outline-success");
    red.setAttribute("class", "btn btn-outline-success");
  });

  blue.addEventListener("click", () => {
    brushColor = "#0000FF";
    blue.setAttribute("class", "btn btn-secondary");
    green.setAttribute("class", "btn btn-outline-success");
    yellow.setAttribute("class", "btn btn-outline-success");
    red.setAttribute("class", "btn btn-outline-success");
  });

  red.addEventListener("click", () => {
    brushColor = "#FF0000";
    red.setAttribute("class", "btn btn-secondary");
    green.setAttribute("class", "btn btn-outline-success");
    yellow.setAttribute("class", "btn btn-outline-success");
    blue.setAttribute("class", "btn btn-outline-success");
  });

  pr.style.visibility = "hidden";
  show_page(gp.value);
  nx.addEventListener("click", (e) => {
    var pn = parseInt(gp.value) + 1;
    gp.value = pn;
    show_page(gp.value);
    e.preventDefault();
  });
  pr.addEventListener("click", (e) => {
    var pp = parseInt(gp.value) - 1;
    gp.value = pp;
    show_page(gp.value);
    e.preventDefault();
  });

  gp.addEventListener("change", () => {
    show_page(gp.value);
  });
});
