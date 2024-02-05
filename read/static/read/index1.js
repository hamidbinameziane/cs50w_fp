var book_id = window.location.href.split("/").pop();
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
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
const und = document.getElementById("undo");
var img = new Image();
var clr = "green"
    var isPainting = false;
    var lineWidth = 15;


    var xx = window.innerWidth * 0.8
    var yy = window.innerWidth * 1.414 * 0.8
    canvas.width = xx
    canvas.height = yy
    var mouseX;
    var mouseY;
    var lastX;
    var lastY;
    var points=[];
    var interval;

    var offsetX=canvas.offsetLeft;
    var offsetY=canvas.offsetTop;
ctx.lineWidth = lineWidth;
        ctx.strokeStyle = clr;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

    function draw(e) {
   
        mouseX=e.offsetX;
        mouseY=e.offsetY;
        if(!isPainting) {
            return;
        }
        
        
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        points.push({x:mouseX,y:mouseY,size:lineWidth,color:clr,mode:"draw"});
        lastX = mouseX;
        lastY = mouseY;
    }

    function m_down(e) {
        mouseX=e.offsetX;
        mouseY=e.offsetY;
        ctx.beginPath();
        if(ctx.lineWidth!=lineWidth){ctx.lineWidth=lineWidth;}
        if(ctx.strokeStyle!=clr){ctx.strokeStyle=clr;}
        ctx.moveTo(mouseX,mouseY);
        lastX = mouseX;
         lastY = mouseY;
        points.push({x:mouseX,y:mouseY,size:lineWidth,color:clr,mode:"begin"});


        isPainting = true;
    };

    function m_up(e) {
        mouseX=e.offsetX;
        mouseY=e.offsetY;
        isPainting = false;
        points.push({x:mouseX,y:mouseY,size:lineWidth,color:clr,mode:"end"});
    };

    function redrawAll() {

        if (points.length == 0) {
            return;
        }
        console.log(points)
    
        ctx.drawImage(img,0,0,xx,yy); 
    
        for (var i = 0; i < points.length; i++) {
            
            var pt = points[i];
    
            var begin = false;
    
            if (ctx.lineWidth != pt.size) {
                ctx.lineWidth = pt.size;
                begin = true;
            }
            if (ctx.strokeStyle != pt.color) {
                ctx.strokeStyle = pt.color;
                begin = true;
            }

            if (pt.mode == "begin" || begin == true) {
                mouseX=pt.x;
                mouseY=pt.y;
                ctx.beginPath();
                ctx.moveTo(mouseX,mouseY);

    
            }
           
                mouseX=pt.x;
                mouseY=pt.y;
                ctx.moveTo(mouseX,mouseY);
                ctx.lineTo(mouseX, mouseY);
                

    


            

            
            if (pt.mode == "end" || (i == points.length - 1)) {
                
                ctx.stroke();
                
            }
        }
        ctx.stroke();
    }

    function undoLast() {
        points.pop();
        redrawAll();
    }

   

    und.addEventListener('mousedown', (e) => {
        interval = setInterval(undoLast, 50);
    })

    und.addEventListener('mouseup', (e) => {
        clearInterval(interval);
    })

    und.addEventListener('mousout', (e) => {
        clearInterval(interval);
    })
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', m_down)
    canvas.addEventListener('mouseup', m_up)
    canvas.addEventListener('mouseout', m_up)

function show_page(page) {
    pg.style.backgroundColor = "white"
fetch(`/pages?q=${page}&b=${book_id}`)
.then((response) => response.json())
.then((data) => {
  


     if (data.page < data.length) {
        nx.style.visibility = "visible"
    }
    else if (data.page >= data.length) {
        nx.style.visibility = "hidden"
    }

    if (data.page > 1) {
        pr.style.visibility = "visible"
    }
    else if (data.page <= 1) {
        pr.style.visibility = "hidden"
    }
    
    gp.setAttribute("max",data.length);
    fetch(data.text)
    .then((res) => res.text())
    .then((text) => {
        p.textContent= text

    })


   
    .catch((e) => console.error(e));
    setTimeout(() => {
   
    gp.value = data.page
    c_n.innerHTML = data.length   
    timestamp = (new Date()).getTime()   
    img.src = data.image + '?_=' + timestamp;
    
    
    
    img.onload = function(){
        ctx.drawImage(img,0,0,xx,yy);   
    }
}, 10);





})
}




document.addEventListener("DOMContentLoaded", function () {

    green.addEventListener('click', () => {
        clr = "green";
        green.setAttribute("class", "btn btn-secondary");
        yellow.setAttribute("class", "btn btn-outline-success");
        blue.setAttribute("class", "btn btn-outline-success");
        red.setAttribute("class", "btn btn-outline-success");
})

yellow.addEventListener('click', () => {
    clr = "yellow";
    yellow.setAttribute("class", "btn btn-secondary");
    green.setAttribute("class", "btn btn-outline-success");
    blue.setAttribute("class", "btn btn-outline-success");
    red.setAttribute("class", "btn btn-outline-success");
})

blue.addEventListener('click', () => {
    clr = "blue";
    blue.setAttribute("class", "btn btn-secondary");
    green.setAttribute("class", "btn btn-outline-success");
    yellow.setAttribute("class", "btn btn-outline-success");
    red.setAttribute("class", "btn btn-outline-success");
})

red.addEventListener('click', () => {
    clr = "red";
    red.setAttribute("class", "btn btn-secondary");
    green.setAttribute("class", "btn btn-outline-success");
    yellow.setAttribute("class", "btn btn-outline-success");
    blue.setAttribute("class", "btn btn-outline-success");
})

    pr.style.visibility = "hidden"
    show_page(gp.value)
    nx.addEventListener('click', (e) => {
        
       var pn = parseInt(gp.value) + 1
        gp.value = pn
        show_page(gp.value)
        e.preventDefault()
    })
    pr.addEventListener('click', (e) => {
        var pp = parseInt(gp.value) - 1
        gp.value = pp
        show_page(gp.value)
        e.preventDefault()
    })
   
    gp.addEventListener('change', () => {
    show_page(gp.value)
    })
})