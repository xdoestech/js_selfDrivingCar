class Sensor{
    constructor(car){
        this.car=car; 
        this.rayCount=15; //three rays will extend as "sight"
        this.rayLength=150;//distance of "sight"
        this.raySpread=Math.PI/2; //angle of spread 45deg

        this.rays=[];
        this.readings=[];//array of output from rays
    }

    update(roadBorders,traffic){
        this.#castRays();
        this.readings=[];
        //collect reading into array
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic)
            )
        }
    }

    //finds all points rays have intersection
        //closest intersection will be used
    #getReading(ray,roadBorders,traffic){ 
        //represents things car can touch(borders, traffic)
        let touches=[];

        //gets all boarder intersections
        for(let i=0;i<roadBorders.length;i++){
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);//if intersection add to touches
            }
        }
        //gets all traffic collisions
        for(let i=0;i<traffic.length;i++){
            const poly = traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
            if(value){
                touches.push(value);//if intersection add to touches
            }
        } 
    }       

        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset); //returns new array of all offsets
            //find minimum "nearest" touch 
            const minOffset=Math.min(...offsets);//spreads array into many values to be read
            return touches.find(e=>e.offset==minOffset); //returns min offset by searching through touches for val == to min
        }
    }

    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                //if ray Count is one pass 0.5
                this.rayCount==1?0.5:i/(this.rayCount-1)//'i' will only go to rayCount -1
            )+this.car.angle;//keeps rays inline with car front

            //ray starting and ending positions
            const start={x:this.car.x, y:this.car.y};
            const end={
                x:this.car.x- 
                    Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-
                    Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);
        }
    }

    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
               end=this.readings[i]; 
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}