class Ant {
  constructor(alpha, beta, Q,numCar) {
    this.alpha = alpha;
    this.beta = beta;
    this.Q = Q || 1;

    this.base = 0;
    this.walk = [];
    this.walkLength = null;

    //  numCar
    this.numCar = 3;

    //  MIN-MAX
    this.pheMin = 0.1;
    this.pheMax = 0.9;
    this.numCar = numCar;

  }

  /**
   * Set the base node for this ant
   * 
   * @param {Number} baseId
   */
  setBase(base) {
    this.base = base;
  }

  /**
   * Construct a solution to the problem
   * 
   * @param  {Array} distances
   * @param  {Array} pheromones
   * @return {[type]}            [description]
   */
  doWalk(distances, pheromones) {
    this.walk = [this.base];
    this.walkLength = null;
    let count = 0;

    for(let i = 1; i < distances.length + this.numCar - 1; i++) {
      let next =  this.chooseNext(this.walk[i - 1], distances, pheromones,count);
      if(next === 0 ){count++;}
      this.walk.push(next);
     }
    //stang add this
    this.walk.push(this.walk[0])
    //console.log([this.walk.length,this.walk])
    // if(this.walk[distances.length + this.numCar - 2] == 0){
    //   this.walk.push(this.walk[0])
    // }
    this.walkLength = this.calculateWalkLength(distances);
    // try{
    //    this.walkLength = this.calculateWalkLength(distances);
    // }catch(err){
    //   this.walkLength = 999999
    // }

  }
 
  chooseNext(currentNode, distances, pheromones,count) {
    let sumall = 0;
    let unvisited = [];

    // ( count < this.numCar - 1  &&  currentNode !== this.walk[0] ) ? unvisited.push(0) : unvisited = [];
   ( count < this.numCar - 1 ) ? unvisited.push(0) : unvisited = [];
    for(let i = 1; i < distances.length ; i++) {
     if (this.walk.indexOf(i) === -1 ) {
        unvisited.push(i);
       
      }
    }

    for(let i = 0; i < pheromones.length; i++) {
      if (i !== currentNode && unvisited.indexOf(i) !== -1) {
        sumall += Math.pow(pheromones[currentNode][i], this.alpha) * Math.pow((1/distances[currentNode][i]), this.beta);
      }
    }

    let probs = [];
    let summul = 0;
    for(let i = 0; i < distances[currentNode].length; i++) {
      if (i !== currentNode && unvisited.indexOf(i) !== -1) {
        let mul = Math.pow(pheromones[currentNode][i], this.alpha) * Math.pow((1/distances[currentNode][i]), this.beta);
        probs.push(mul/sumall);
        summul += mul;
      }
    }

    let rnd = Math.random();
    let x = 0;
    let tally = probs[x];
    while (rnd > tally && x < probs.length - 1) {
      tally += probs[++x];
    }
    
    return unvisited[x];
  }

  calculateWalkLength(distances) {
    // let len = 0;
    // for(let i = 1; i < this.walk.length; i++) {
    //   len += distances[this.walk[i-1]][this.walk[i]];
    // }
    
    let sum = Array.apply(null, Array(this.numCar)).map(Number.prototype.valueOf,0);

    let carIndex = 0
    for(let i = 1; i < this.walk.length; i++) {
      sum[carIndex] += distances[this.walk[i-1]][this.walk[i]];
      if(this.walk[i-1] === 0 && this.walk[i] === 0)sum[carIndex] = 999
      if(this.walk[i] === 0)carIndex++
    }
    //console.log(sum)
    const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    let avg = average(sum);
    const allSum = arr => arr.reduce( ( p, c ) => p + c, 0 );
    let allSums = allSum(sum) 

    return avg + Math.max.apply(null, sum)
    //return Math.max.apply(null, sum);
    //return allSums + avg + Math.max.apply(null, sum);
  }

  layPheromones(pheromones) {
    for(let i = 1; i < this.walk.length; i++) {
      pheromones[this.walk[i-1]][this.walk[i]] += (1/this.walkLength) * this.Q;

      if(pheromones[this.walk[i-1]][this.walk[i]] > this.pheMax){
        pheromones[this.walk[i-1]][this.walk[i]] = this.pheMax
        this.pheMax -= 1/pheromones[this.walk[i-1]][this.walk[i]];
      }else if(pheromones[this.walk[i-1]][this.walk[i]] < this.pheMin){
        pheromones[this.walk[i-1]][this.walk[i]] = this.pheMin
        this.pheMax -= 1/pheromones[this.walk[i-1]][this.walk[i]];
      }
      this.pheMax -= 1/pheromones[this.walk[i-1]][this.walk[i]];

    

      pheromones[this.walk[i]][this.walk[i-1]] += (1/this.walkLength) * this.Q;

      if(pheromones[this.walk[i]][this.walk[i-1]] > this.pheMax){
        pheromones[this.walk[i]][this.walk[i-1]] = this.pheMax
        this.pheMax -= 1/pheromones[this.walk[i-1]][this.walk[i]];

      }else if(pheromones[this.walk[i]][this.walk[i-1]] < this.pheMin){
        pheromones[this.walk[i]][this.walk[i-1]] = this.pheMin
        this.pheMax -= 1/pheromones[this.walk[i]][this.walk[i-1]];
      }
      this.pheMax -= 1/pheromones[this.walk[i-1]][this.walk[i]];



      // console.log(pheromones[this.walk[i-1]][this.walk[i]])
      // console.log(pheromones[this.walk[i]][this.walk[i-1]])
    }
  }
}

export default Ant;
