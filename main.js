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

//N is number of AI cars to generate
const N=1000
const cars=generateCars(N);
let bestCar=cars[0]; //use let for changing global variables

//set best brain in storage to value
if(localStorage.getItem("bestBrain")){
    //
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}
//add traffic
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
];
animate();

//save best brain in local storage
function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}
//funciton to generate N "AI" cars
function generateCars(N){
    const cars=[];
    for(let i=1;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));

    }
    return cars;
}
function animate(time){
    //update every car in traffic
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    //update car
    for(let i=0;i<cars.length;i++){
       cars[i].update(road.borders,traffic); 
    }
    //find bestcar
        //car with y value equal to min value of all y values
    bestCar=cars.find(
        c=>c.y==Math.min(
            //... spreads values or converts from array to csv basically
            ...cars.map(c=>c.y)//create new array of only y values
        ));
    
    carCanvas.height=window.innerHeight; //reset car properties in window
    networkCanvas.height=window.innerHeight;

    //car position is fixed road is updated
    carCtx.save(); 
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7); //places the car 
    road.draw(carCtx);
    //draw all the traffic cars
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "white");
    }
    //draw all AI cars
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx, "blue"); 
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue",true); 
    carCtx.restore();
    //adds animation and draws network
    networkCtx.lineDashOffset=-time/50; //animate netowork lines to move
    //visualize nueral network
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);//calls animate many times
}

