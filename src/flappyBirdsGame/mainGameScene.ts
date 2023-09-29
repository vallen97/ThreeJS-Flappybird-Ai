import * as THREE from "three";
import Pipe from "./pipes";
import Bird from "./bird";

export default class MainGameScene extends THREE.Scene {
  //  variables used through the class
  private readonly camera: THREE.PerspectiveCamera;
  private readonly keyDown = new Set<string>();
  private directionVector = new THREE.Vector3();
  private pipes: any = [];
  private canCreatePipe: boolean = true;
  private bird: any = null;
  private moveUp: boolean = true;

  constructor(camera: THREE.PerspectiveCamera) {
    super();
    this.camera = camera;
  }

  // runs when the game is started
  async initialize() {
    //  make and set a bird
    this.bird = new Bird();

    // add bird to the scene
    this.add(this.bird.getBird());

    // make a pipes
    this.createPipe();

    // set tthe position of tthe camera
    this.camera.position.z = 1;
    this.camera.position.y = 0.5;

    // make a light and set the position
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 4, 2);
    // add the light to the sceme
    this.add(light);

    // listners for key up and doen
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyDown.add(event.key.toLowerCase());
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyDown.delete(event.key.toLowerCase());
    // if the space key is pressed move up the bird
    if (event.key === " ") this.moveUp = true;
  };

  private async createPipe() {
    // if there is no bird dont make a pipe
    if (!this.bird) return;
    // get the height sizes of top and bottom pipes
    let pipeHeight: Array<number> = this.mapPipes(24, 24);

    // make the top pipe
    const tp = new Pipe(3, pipeHeight[0], 5);
    // add speed to the pipe
    tp.setVelocity(
      this.directionVector.x * 0.2,
      this.directionVector.y * 0.2,
      this.directionVector.z * 0.2
    );

    // set the position of the top pipe
    tp.setPosition(12, 8, -10);

    // same as top pipe butt for bottom pipe
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
      // so there are not too many pipes are made
      this.canCreatePipe = false;
      setTimeout(() => {
        this.canCreatePipe = true;
      }, 100);
    }
  }

  // move the pipe
  private updatePipes() {
    // loop through all of the pipes
    for (let i = 0; i < this.pipes.length; i++) {
      // check for collision between the bird and pipes
      if (
        this.bird
          .getBird()
          .position.distanceToSquared(this.pipes[i].getPipe().position) < 28.125
      ) {
        // Stop the game, or pause the game and
        console.log("Bird has hit a pipe");
      }
      // Move the pipe
      this.pipes[i].update(0.1);

      // make a pipe
      if (this.pipes.length - 1 == i)
        if (this.pipes[i].getPipeX() >= -0.1 && this.pipes[i].getPipeX() <= 0)
          // if pipe is between x axis values
          this.createPipe();

      // if the pipe is marked as remove
      if (this.pipes[i].getShouldRemove()) {
        // remove from scene
        this.remove(this.pipes[i]);
        // remove pipe from array
        this.pipes.splice(i, 1);
      }
    }
  }

  update() {
    // move and check collision for pipes
    this.updatePipes();
    // move the bird up or down
    this.moveUp = this.bird.update(this.moveUp);
  }

  mapPipes(maxTop: number, MaxBottom: number): Array<number> {
    // make height for the pipes
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
}
