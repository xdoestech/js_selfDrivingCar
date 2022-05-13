class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.controls=new Controls();
    }

    draw(ctx){
        ctx.beginPath();
        ctx.rect( //y axis goes top to bottom
            this.x-this.width/2,
            this.y-this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
    }
}