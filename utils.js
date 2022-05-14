//used everywhere
function lerp(A,B,t){
//when t = 0 return A
//when t = 1 return B
//else t moves t away from A
    return A+(B-A)*t;
}

//used in car.js
//https://www.youtube.com/watch?v=fHOLQJo0FjQ
function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

//used in cars.js
//#assesdamge
function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            //make segments from each point of polygon
                //take all segment from first and compare to second polygon
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],//use mod to keep value in range of poly1
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

//used in visualizer.js
function getRGBA(value){
    const alpha=Math.abs(value);
    //set color of line
    //if value 0 do nothing else max color
    //opacity is strength
    const R=value<0?0:255;
    const G=R; //yellow is green and red
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";

}

