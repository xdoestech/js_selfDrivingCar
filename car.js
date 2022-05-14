class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3){
        //SETTING INITIAL POSITION VALUES
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        //SETTING INITIAL MOVEMENT VALUES 
        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        //SETTING CONTROL TYPE
            //this.useBrain is true if controlType == "AI"
        this.useBrain=controlType=="AI";
        //ADDING SENSOR
        //only add sensor if not a DUMMY
        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            //new nueral netowrk with array of values for
                //input/hidden/output layers
            this.brain=new NeuralNetwork(
                //input layer count is the number of rays
                [this.sensor.rayCount,6,4] //4 output layers (forward, backward,left, right)
            );
        }
        this.controls=new Controls(controlType);
        
    }

    //updates sensor and RETURNS readings to nueral netowrk
    update(roadBorders,traffic){
        //car will not move if damaged
        if(!this.damaged){
            this.#move();
            this.polygon=this.#creeatePolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            //nueron recieve LOW values if reading is far
            //HIGH values if reading is close
            const offsets=this.sensor.readings.map(
                //if reading is null return 0
                //otherwise return 1-sensor offset
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);
            //console.log(outputs); SEE OUTPUT ARRAY
            
            //set controls to be output of neural network
            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
        
    }

    //check if border touches polygon
    //will work as long as polygon speed is less than update speed
    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){ //roadBoarder[i] is a line segment not the polygon but itll work
                return true;
            }
        }
        //check for traffic collision
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){ //roadBoarder[i] is a line segment not the polygon but itll work
                return true;
            }
        }
        return false;
    }

    //finds corners of 'car' rectangle object
    #creeatePolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        //adding Points and changing values will create FUNKY SHAPES
        //top right
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad,
        });
        //top left
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad,
        });
        //bottom right
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad, //mathpi for 180deg
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad,
        });
        //bottom left
        points.push({
            //set the Math.PI-this.angle for FUNKY SHAPES
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad, //mathpi for 180deg
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad,
        });
        return points;
    }

    //Rules for movement of car (maxSpeed, friction, turning physics)
    #move(){
        //add acceleration
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        //set cap on the speed forward
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        //set cap on the speed reverse
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }
        //add friction to reduce speed
        if(this.speed>0){
            this.speed-=this.friction;
        }
        //add friction to reduce speed REVERSE
        if(this.speed<0){
            this.speed+=this.friction;
        }
        //keep box from acting weird on very slow speeds
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){ //check out Box2D library
            const flip=this.speed>0?1:-1;//value is 1 OR minus 1
            //add left right motion
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }
        //unit circle rotated 90deg clockwise
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
        //set movement direction to be negative speed
        //y axix is = 0 at top of screen
    } 

    //draws car and passes in color
    draw(ctx, color){
        if(this.damaged){
            ctx.fillStyle="red";
        }else{
            ctx.fillStyle=color;
        }

        ctx.beginPath();
        //use polygon corners to 'draw' shape 
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y)
        }
        ctx.fill();
        /////draws lines representing sensor if applicable 
        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}