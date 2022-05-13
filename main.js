const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext('2d');
const road=new Road(canvas.width/2,canvas.width*0.9); //set road size
const car=new Car(road.getLaneCenter(1),100,30,50);

animate();

function animate(){
    car.update();

    canvas.height=window.innerHeight; //reset car properties in window
    
    //car position is fixed road is updated
    ctx.save(); 
    ctx.translate(0,-car.y+canvas.height*0.7); //places the car 
    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);//calls animate many times
}

