//many level nueral network
class NeuralNetwork{
    //neuronCounts is array
        //number of nuerons on each level
    constructor(neuronCounts){ 
        this.levels=[];//array of levels 
        //for each neuron add level defined below
        for(let i=0;i<neuronCounts.length-1;i++){
            //specifies input and output count 
            //LEVEL obj added to levels array
            this.levels.push(new Level( //each level made from neuronCounts
                neuronCounts[i],
                neuronCounts[i+1]
            ));
        }
    }

    //gets outputs
    //final output should tell car direction to move
    static feedForward(givenInputs, network){
        //level feedForward returns array   
        //use given inputs and network levels to get new output 
        let outputs=Level.feedForward(
            givenInputs,
            network.levels[0]);
        //do above for every level 
        for(let i=1;i<network.levels.length;i++){
            //output of previous level is input for new level
            outputs=Level.feedForward(
                outputs,
                network.levels[i]);
        }
        return outputs; //an array of values indicatinng direction
    }

}


class Level{
    //input nuerons/output nuerons  
    //inputs values FROM CAR SENSOR
    //outputs result from weights and biases
    constructor(inputCount,outputCount){
        //LEVEL INPUTS
        //create arrays for parts of nueral network
        this.inputs=new Array(inputCount);
        //LEVEL OUTPUTS
        //outputs are computed with some combo of weights and biases   
        this.outputs=new Array(outputCount);
        //LEVEL BIASES
        //output fires on value above biases
        this.biases=new Array(outputCount);//each output nueron has bias

        //array of weights is an output array for each input array  
            //for each input there is an output count of connections 
        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
        }

        Level.#randomize(this);

    }
    //radomize by setting value to random num between -1 and 1
        //help compute outputs
        //static for serializing (convert to series of bytes)
    static #randomize(level){
        //randomize weight corresponding to each input and output
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1; //randomize
            }
        }
        //randomize biases
        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1; //randomize
        }
    }

    //compute output values array
    //https://www.youtube.com/watch?v=Ve9TcAkpFgY&list=PLB0Tybl0UNfYoJE7ZwsBQoDIG4YN9ptyY&index=7
    static feedForward(givenInputs,level){
        //set level inputs to given inputs 
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }
        //output calculation 
            //calculate sum from level input value and weights
        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            //multiply input by weights and save to sum
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }
            //determine if output should be used or ignored
            if(sum>level.biases[i]){
                level.outputs[i]=1;//turn on
            }else{
                level.outputs[i]=0;//turn off
            }
        }
        return level.outputs;
    }
}