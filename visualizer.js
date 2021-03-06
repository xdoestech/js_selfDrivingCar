//IN MAIN CHANGE car init from "AI" to "KEYs " to control car and see visualizer better
//source: https://www.youtube.com/watch?v=lok3RVBwSqE&list=PLB0Tybl0UNfYoJE7ZwsBQoDIG4YN9ptyY&index=8
class Visualizer{
    //bounds of network visualizer
    static drawNetwork(ctx,network){
        const margin=50;
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;
        
        const levelHeight=height/network.levels.length;

        for(let i=network.levels.length-1;i>=0;i--){
            const levelTop=top+
                lerp(
                    height-levelHeight,
                    0,
                    network.levels.length==1
                        ?0.5
                        :i/(network.levels.length-1)
                );
            
            ctx.setLineDash([7,3]);
            //bounds for each level
            //add output arrows
                    //output represents direction car will move
            Visualizer.drawLevel(ctx,network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i==network.levels.length-1
                //javascript arrows (up,left,right,down)
                //https://www.htmlsymbols.xyz/arrow-symbols
                    ?["\u2B06","\u2B05","\u27A1","\u2B07"]
                    :[]
            );
        }
            
    }

    //opacity 0-1 
        //direct correlation to bias/strength 
    static drawLevel(ctx,level,left,top,width,height, outputLabels){
        const right=left+width;
        const bottom=top+height;

        //destructure level for easy access
        const {inputs,outputs,weights,biases}=level;

        //draw line between input and output layers
        for(let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs,i,left,right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs,j,left,right),
                    top
                );
                ctx.lineWidth=2;
                //function in utils.js
                ctx.strokeStyle=getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        //set inputs(bottom of screen) and outputs(top of screen) to level
        //CHANGE NEEDED
        //IDEALLY nodeRadius changes based on NUMBER OF NODES
            //MODIFY LERP
            //MODIFY RADIUS 
        const nodeRadius=18;
        for(let i=0;i<inputs.length;i++){
            const x=lerp(
                left,
                right,
                inputs.length==1
                    ?0.5
                    :i/(inputs.length-1)
            );
            ctx.beginPath();
            //invisible background node
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();
            
            //visible node
            ctx.beginPath();
            //draw nodes
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(inputs[i]);//fill color based on input
            ctx.fill();
        }

        //output nodes and biases 
        for(let i=0;i<outputs.length;i++){
            const x=lerp(
                left,
                right,
                outputs.length==1
                    ?0.5
                    :i/(outputs.length-1)
            );
            ctx.beginPath();
            //invisible background node
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();

            //visible node
            ctx.beginPath();
            //draw nodes
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(outputs[i]);//fill based on output
            ctx.fill();
            
            //show biases
                //rings around output nodes
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.setLineDash([3,3]); 
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillStyle="black";
                ctx.strokeStyle="white";
                ctx.font=(nodeRadius*1.5)+"px Arial";
                ctx.fillText(outputLabels[i],x,top+nodeRadius*0.1);
                ctx.lineWidth=0.5;
                ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.1);
            }
        }

        
    }

    //helper method to get lerp node
    static #getNodeX(nodes,index,left,right){
        return lerp(
            left,
            right,
            nodes.length==1
                ?0.5
                :index/(nodes.length-1)
        );
    }

    
}