class Ant {
  constructor(alpha, beta, Q) {
    this.alpha = alpha;
    this.beta = beta;
    this.Q = Q || 1;

    this.base = 0;
    this.walk = [];
    this.walkLength = null;
    this.numCar = 3;
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
    console.log([this.walk.length,this.walk])
    // if(this.walk[distances.length + this.numCar - 2] == this.base){
    //   return ;
    // }
    try{
      this.walkLength = this.calculateWalkLength(distances);
    }catch(er){}

  }
 
  chooseNext(currentNode, distances, pheromones,count) {
    let sumall = 0;
    let unvisited = [];

   ( count < this.numCar - 1  &&  currentNode !== this.walk[0] ) ? unvisited.push(0) : unvisited = [];
    for(let i = 1; i < distances.length + + this.numCar - 1; i++) {
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
    let len = 0;
    for(let i = 1; i < this.walk.length; i++) {
      
      len += distances[this.walk[i-1]][this.walk[i]];
    }
    
    return len;
  }

  layPheromones(pheromones) {
    for(let i = 1; i < this.walk.length; i++) {
      pheromones[this.walk[i-1]][this.walk[i]] += (1/this.walkLength) * this.Q;
      pheromones[this.walk[i]][this.walk[i-1]] += (1/this.walkLength) * this.Q;
    }
  }
}

export default Ant;
