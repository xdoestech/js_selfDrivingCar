class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;

        this.controls=new Controls();
    }

    update(){
        this.#move();
    }

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

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);//rotation physics
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect( //y axis goes top to bottom
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();//to prevent infinite loop potentially
    }
}