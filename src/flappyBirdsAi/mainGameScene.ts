import * as THREE from "three";
import Pipe from "./pipes";
import Bird from "./bird";

export default class MainGameScene extends THREE.Scene {
  // variables for the scene
  private readonly camera: THREE.PerspectiveCamera;
  private readonly keyDown = new Set<string>();
  private directionVector = new THREE.Vector3();

  // variables that are used by the game
  private pipes: any = [];
  private canCreatePipe: boolean = true;
  private birds: Array<any> = [];
  private savedBirds: Array<any> = [];
  private TOTAL: number = 10;
  private isGameOver: boolean = false;
  private isPlaying: boolean = false;
  private createNewBirds: boolean = true;
  // NOTE: vairable on screen that need to be updated

  private displayCurrentGeneration: string = "Current Generation: 0";
  private displayScore: string = "Current Score: 0";
  private currentScore: number = 0;
  // Variables for the AI
  private currentGeneration: number = 1;
  // Saving and loading the bird
  private saveBest: boolean = false;
  private loadBest: boolean = false;

  constructor(camera: THREE.PerspectiveCamera) {
    super();
    this.camera = camera;
  }

  async initialize() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // setup the game
    this.setup();

    // set the camera position
    this.camera.position.z = 1;
    this.camera.position.y = 0.5;

    // make and set the lights posititon
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 4, 2);
    //  add light to the scene
    this.add(light);
  }

  private async createPipe() {
    // if there are no more birds
    if (this.birds.length == 0) return;
    // heights of the pipes
    let pipeHeight: Array<number> = this.mapPipes(24, 24);

    // top pipe
    const tp = new Pipe(3, pipeHeight[0], 5);

    // set speed
    tp.setVelocity(
      this.directionVector.x * 0.2,
      this.directionVector.y * 0.2,
      this.directionVector.z * 0.2
    );

    // set position
    tp.setPosition(12, 8, -10);

    // same as top pipe
    const bp = new Pipe(3, pipeHeight[1], 5);
    bp.setVelocity(
      this.directionVector.x * 0.2,
      this.directionVector.y * 0.2,
      this.directionVector.z * 0.2
    );

    bp.setPosition(12, -7, -10);

    // Make sure that there aren't too many pips that are spawned
    if (this.pipes.length <= 6 && this.canCreatePipe) {
      // add Top Pipe to the scene
      this.add(tp.getPipe());
      this.pipes.push(tp);

      // Add Bottom Pipe to the scene
      this.add(bp.getPipe());
      this.pipes.push(bp);
      // limit the amoutt tof pipe that can be made
      this.canCreatePipe = false;
      setTimeout(() => {
        this.canCreatePipe = true;
      }, 100);
    }
  }

  private updatePipes() {
    // Loop through all of the pipes on the screen
    for (let i = 0; i < this.pipes.length; i++) {
      // Loop through all of the birds
      for (let j = 0; j < this.birds.length; j++) {
        // Check if any bird has had a collision with a pipe
        this.birds[j].setPipes(
          this.pipes[0].getPipe(),
          this.pipes[1].getPipe()
        );
        //  hit detection for the pipe and birds
        if (
          this.birds[j]
            .getBird()
            .position.distanceToSquared(this.pipes[i].getPipe().position) <
            28.125 ||
          this.birds[j].getIsDead()
        ) {
          // If a bird has hit a pipe remove and move the bird into the saved birds
          this.remove(this.birds[j].getBird());
          this.savedBirds.push(this.birds.splice(j, 1)[0]);
        } else {
          // AI decides the up or down movement of the bird
          this.birds[j].newLook(
            this.pipes[0].getPipe(),
            this.pipes[1].getPipe()
          );
        }
      }

      // Move the pipe
      this.pipes[i].update(0.1);

      // To slow down the create pipe function, if this is not here,
      // it will call the function a lot of times
      if (this.pipes.length - 1 == i)
        if (this.pipes[i].getPipeX() >= -0.1 && this.pipes[i].getPipeX() <= 0)
          this.createPipe();

      // If the pipe is too far to the left remove the pipe
      if (this.pipes[i].getShouldRemove()) {
        this.remove(this.pipes[i].getPipe());
        this.pipes.splice(i, 1);
        // i--;
      }
    }
  }

  update() {
    this.updatePipes();

    // Move this into the bird, so we done need to keep track of the movement
    for (let i = 0; i < this.birds.length; i++) {
      this.birds[i].update();
    }

    // this is for the next set of birds
    if (this.birds.length == 0) {
      this.reInitalize();
    }
  }

  // Getting the pipe heights
  mapPipes(maxTop: number, MaxBottom: number): Array<number> {
    const minTop: number = 0.1;
    const birdHeight: number = 1.5;

    let topPipeLength: number = 0;
    let bottomPipeLength: number = 0;

    topPipeLength = Math.floor(
      Math.random() * (maxTop - (minTop + birdHeight)) + (minTop + birdHeight)
    );

    bottomPipeLength = 10 - topPipeLength;
    let temp: number = 0;
    if (bottomPipeLength < 1) {
      temp = bottomPipeLength - 1;
      topPipeLength + temp;
    }
    return [topPipeLength, bottomPipeLength];
  }

  // Reinitalize the game
  reInitalize() {
    // Remove all of the pipes and birds,
    for (let i = 0; i < this.pipes.length; i++)
      this.remove(this.pipes[i].getPipe());

    for (let i = 0; i < this.birds.length; i++)
      this.remove(this.birds[i].getBird());

    // reset the values of variables
    this.pipes = [];
    this.canCreatePipe = true;
    this.birds = [];
    this.savedBirds = [];

    this.isPlaying = false;
    this.displayCurrentGeneration =
      "Current Generation: " + this.currentGeneration;
    this.displayScore = "Current Score: " + this.currentScore;

    // start the game
    this.initialize();
  }

  setup() {
    if (this.isPlaying == false) return;

    // Make new birds
    if (this.createNewBirds) {
      for (let i = 0; i < this.TOTAL; i++) {
        this.birds[i] = new Bird();
        this.add(this.birds[i].getBird());
      }
    }

    this.createPipe();
  }

  // next generation for the birds
  nexttGeneration() {
    // clear the birds
    this.birds = [];

    let BestBird;

    // calculate fitness for the bird
    this.calculateFitness();

    // get the best bird
    BestBird = this.pickOne();

    // set the best bird to the new birds
    for (let i = 0; i < this.TOTAL; i++) {
      this.birds[i] = BestBird;
    }

    // memory management for TensorFlow
    for (let i = 0; i < this.savedBirds.length; i++) {
      this.savedBirds[i].dispose();
    }

    // clear variables
    this.savedBirds = [];
    this.createNewBirds = true;

    // keep track of the current generation
    this.currentGeneration++;
    this.displayCurrentGeneration =
      "Current Generation: " + this.currentGeneration;
  }

  calculateFitness() {
    // calculate fitness of all the birds
    var sum: number = 0;
    let tempBirdScore: Array<number> = new Array();
    // loop through all saved birds
    for (let i = 0; i < this.savedBirds.length; i++) {
      if (!this.savedBirds[i]) continue;

      // get the score
      tempBirdScore[i] = this.savedBirds[i].getScore();

      // add the score
      sum += this.savedBirds[i].getScore();
    }

    // setting fitness of the birds
    for (let j = 0; j < this.savedBirds.length; j++) {
      if (sum <= 0) {
        this.savedBirds[j].setFitness(0);
      } else {
        if (typeof this.savedBirds[j] !== "undefined") {
          this.savedBirds[j].setFitness(tempBirdScore[j] / sum);
        }
      }
    }
  }

  // pick the besttt bird
  pickOne(model?: any): Bird {
    let index: number = 0;
    let r: number = Math.random();

    // while random number is greater than 0
    while (r > 0) {
      // if birds are more than 0
      if (this.savedBirds.length > 0) {
        // if there is a bird
        if (typeof this.savedBirds[index] === "undefined") continue;

        // minus random from fitness
        r = r - this.savedBirds[index].getFitness();
        // more to the next bird
        index++;
        // if index goes over ttthe bird lengtth
        if (index > this.savedBirds.length - 1) break;
      }
    }
    index--;

    // index is more than the snake length, make index to the length of bird
    if (index >= this.savedBirds.length) index = this.savedBirds.length - 1;
    else if (index < 0) index = 0;

    let bird: any = this.savedBirds[index];

    // remove the save bird
    this.savedBirds.splice(index, 1);

    // savign the best bird
    if (this.saveBest) {
      // bird.save(saveBestType);
      this.saveBest = true;
    }

    // child of the bird
    var child;

    // make a new bird
    if (model) child = new Bird(bird.getBirdBrain(), null, model);
    else child = new Bird(bird.getBirdBrain());

    // mutate the bird
    child.mutate();

    // return the bird
    return child;
  }
}
