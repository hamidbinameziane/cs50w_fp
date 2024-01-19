document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d"); 
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas.getContext("2d"); 
    fetch("/pages")
    .then((response) => response.json())
    .then((image) => {
        console.log(image.image)
        var background = new Image();
        var w = window.innerWidth/2
        background.src = image.image
        console.log(background.src)
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth*2;
        
        
        background.onload = function(){
            ctx.drawImage(background,0,0);   
        }
        var background2 = new Image();
        background2.src = image.image
        
        canvas2.width = window.innerWidth;
        console.log(window.innerWidth/2)
        canvas2.height = window.innerWidth*2;
        
        
        background2.onload = function(){
            ctx2.drawImage(background2,w,0);   
        }

    })
})