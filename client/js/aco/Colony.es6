import _ from 'lodash';
import Ant from './Ant.es6';

var TIMEOUT = 50;

class Colony {
  constructor(popSize, maxIterations, distances, alpha, beta, pho, ip, Q, numCar) {
    this.popSize = popSize;
    this.maxIterations = maxIterations;
    this.distances = distances;

    this.alpha = alpha;
    this.beta = beta;
    this.pho = pho;
    this.Q = Q;
    this.ip = ip;
    this.numCar = numCar

    this.population = [];
    this.pheromones = [];
    this.bestLength = null;
    this.bestSolution = null;
    this.continue = false;

    this.onNewBest = null;

    //  Best Iteration
    this.bestIteration = 0;
    
    //  Best Global
    this.bestGlobal = null;

    //  Counter
    this.mCounter = 0;

  }

  setOnNewBest(onNewBest) {
    this.onNewBest = onNewBest;
  }

  setOnIteration(onIteration) {
    this.onIteration = onIteration;
  }

  initialise() {
    this.population = [];
    this.pheromones = [];
    this.bestSolution = null;
    this.continue = true;

    for(let i = 0; i < this.popSize; i++) {
      this.population[i] = new Ant(this.alpha, this.beta, this.Q, this.numCar);
    }
    this.bestGlobal = new Ant(this.alpha, this.beta, this.Q, this.numCar);

    for(let x = 0; x < this.distances.length; x++) {
      this.pheromones[x] = [];
      for(let y = 0; y < this.distances.length; y++) {
        if (x !== y) {
          this.pheromones[x][y] = this.ip;
        }
      }
    }
  }

  iterate() {
    let x = 0, that = this;
    doWork(x);

    function doWork(x) {
      setTimeout(function() {
        that.sendOutAnts();
        that.updatePheromones();
        x++;
        this.mCounter++;
        that.daemonActions(x);
        if (x < that.maxIterations && that.continue) {
          doWork(x);
        }
      }, TIMEOUT);
    }
  }

  sendOutAnts() {
    for(let i = 0; i < this.popSize; i++) {
      //console.log('Ant', i, this.population[i]);
      this.population[i].doWalk(this.distances, this.pheromones);
    }
  }

  updatePheromones() {
    this.evaporatePheromones();
    if(this.mCounter < 25){
      if(getRandomInt(1, 10) > 4){
        this.population[this.bestIteration].layPheromones(this.pheromones);
      }else{
        this.bestGlobal.layPheromones(this.pheromones);
      }
    }else{
      if(getRandomInt(1, 10) < 4){
        this.population[this.bestIteration].layPheromones(this.pheromones);
      }else{
        this.bestGlobal.layPheromones(this.pheromones);
      }
    }
    for(let i = 0; i < this.popSize; i++) {
      //console.log('Ant', i, this.population[i]);
      this.population[i].doWalk(this.distances, this.pheromones);
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
    // for(let i = 0; i < this.popSize; i++) {
    //   this.population[i].layPheromones(this.pheromones);
    // }
  }

  evaporatePheromones() {
    for(let x = 0; x < this.distances.length; x++) {
      for(let y = 0; y < this.distances.length; y++) {
        if (x !== y) {
          this.pheromones[x][y] = (1 - this.pho) * this.pheromones[x][y];
        } 
      }
    }
  }

  daemonActions(x) {
    for(let i = 0; i < this.popSize; i++) {
      if (!this.bestSolution || this.population[i].walkLength < this.bestLength) {
        this.bestSolution = _.cloneDeep(this.population[i].walk);
        this.bestLength = _.clone(this.population[i].walkLength);
        if (this.onNewBest) {
          this.onNewBest(x, this.bestSolution, this.bestLength);
          //  console.log(this.bestLength)
          this.bestIteration = i
          if(this.bestGlobal === 0){
            this.bestGlobal = this.population[this.bestIteration];
          }else if(this.bestLength < this.bestGlobal.walkLength){
            this.bestGlobal = this.population[this.bestIteration]
          }
        }
      }
    }
    if (this.onIteration) {
      this.onIteration(x, _.clone(this.pheromones))
    };
  }
}

export default Colony;