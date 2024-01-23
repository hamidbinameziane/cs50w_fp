document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    const p = document.getElementById("text");
    const gp = document.getElementById("go_page");
    const pg = document.getElementById("pg");
    const oc = document.getElementById("oc");
    gp.addEventListener('change', () => {
        pg.style.backgroundColor = "white"
        oc.style.display = "block"
    var page = gp.value
    fetch(`/pages?q=${page}`)
    .then((response) => response.json())
    .then((data) => {
        fetch(data.text)
        .then((res) => res.text())
        .then((text) => {
            p.textContent= text

        })
        .catch((e) => console.error(e));
        setTimeout(() => {
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
})
})