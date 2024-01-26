var book_id = window.location.href.split("/").pop();
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const p = document.getElementById("text");    
const pg = document.getElementById("pg");
const gp = document.getElementById("go_page");
const c_n = document.getElementById("count");
const pr = document.getElementById("previous");
const nx = document.getElementById("next");


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
    var img = new Image();
    img.src = data.image + '?_=' + timestamp;
    x = window.innerWidth
    y = window.innerWidth * 1.414
    canvas.width = x
    canvas.height = y
    
    
    img.onload = function(){
        ctx.drawImage(img,0,0,x,y);   
    }
}, 10);
})
}
document.addEventListener("DOMContentLoaded", function () {
    pr.style.visibility = "hidden"
    show_page(gp.value)
    nx.addEventListener('click', () => {
       var pn = parseInt(gp.value) + 1
        gp.value = pn
        show_page(gp.value)
    })
    pr.addEventListener('click', () => {
        var pp = parseInt(gp.value) - 1
        gp.value = pp
        show_page(gp.value)
    })
   
    gp.addEventListener('change', () => {
    show_page(gp.value)
    })
})