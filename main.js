/*
CAR INIT HERE
CAR: car.js
SENSOR: sensor.js
RAY COUNT INIT: sensor.js
VISUALIZER: visualizer.js
*/

const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road=new Road(carCanvas.width/2,carCanvas.width*0.9); //set road size
const car=new Car(road.getLaneCenter(1),100,30,50,"AI",5);
//add traffic
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY")
];
animate();

function animate(time){
    //update every car in traffic
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    //update car
    car.update(road.borders,traffic);

    carCanvas.height=window.innerHeight; //reset car properties in window
    networkCanvas.height=window.innerHeight;

    //car position is fixed road is updated
    carCtx.save(); 
    carCtx.translate(0,-car.y+carCanvas.height*0.7); //places the car 
    road.draw(carCtx);
    //draw all the traffic cars
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "white");
    }
    car.draw(carCtx, "blue");
    carCtx.restore();
    //adds animation and draws network
    networkCtx.lineDashOffset=-time/50; //animate netowork lines to move
    //visualize nueral network
    Visualizer.drawNetwork(networkCtx,car.brain);
    requestAnimationFrame(animate);//calls animate many times
}

