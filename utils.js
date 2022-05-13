function lerp(A,B,t){
//when t = 0 return A
//when t = 1 return B
//else t moves t away from A
    return A+(B-A)*t;
}