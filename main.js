const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext('2d');
const road=new Road(canvas.width/2,canvas.width*0.9); //set road size
const car=new Car(road.getLaneCenter(1),100,30,50,"KEYS",5);
//add traffic
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY")
];
animate();

function animate(){
    //update every car in traffic
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    //update car
    car.update(road.borders,traffic);

    canvas.height=window.innerHeight; //reset car properties in window
    
    //car position is fixed road is updated
    ctx.save(); 
    ctx.translate(0,-car.y+canvas.height*0.7); //places the car 
    road.draw(ctx);
    //draw all the traffic cars
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx, "white");
    }
    car.draw(ctx, "blue");
    ctx.restore();
    requestAnimationFrame(animate);//calls animate many times
}

