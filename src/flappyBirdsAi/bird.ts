import * as THREE from "three";
import { NeuralNetwork } from "../AI/nn";

// Custom color type
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;
export default class Bird {
  // Variable for the bird AI class
  // bird and color of the bird
  private readonly bird: THREE.Mesh;
  private birdColor: Color = "#3552f9";

  // information foe the bird
  private pipes: Array<any> = [];
  private isDead: boolean = false;
  private moveUp: boolean = false;

  // variables for the AI
  private brain: NeuralNetwork;
  private readonly numberOfInputNodes: number = 10;
  private readonly numberOfHiddenNode: number = 20;
  private readonly numberOfOutputNodes: number = 2;
  private fitness: number = 0;
  private score: number = 0;

  constructor(brain?: any, secondModel?: any, savedModel?: any) {
    // make and set tthe bird
    const geometry = new THREE.SphereGeometry(1.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: this.birdColor });
    this.bird = new THREE.Mesh(geometry, material);

    // set position of bird
    this.bird.position.x = -7.5;
    this.bird.position.y = 0;
    this.bird.position.z = -10;

    // if there is an AI model
    if (savedModel != null)
      this.brain = new NeuralNetwork(
        savedModel,
        this.numberOfInputNodes,
        this.numberOfHiddenNode,
        this.numberOfOutputNodes
      );
    else if (brain) this.brain = brain.copy();
    else
      this.brain = new NeuralNetwork(
        this.numberOfInputNodes,
        this.numberOfHiddenNode,
        this.numberOfOutputNodes
      );
  }

  // get tbird object
  getBird(): THREE.Mesh {
    return this.bird;
  }

  // move the bird
  update(gravity: number = 0.175) {
    let velocityY = 0;
    if (this.moveUp) {
      velocityY = gravity * 2.5;
      this.moveUp = false;
    } else {
      velocityY = gravity * -0.1;
    }
    this.bird.position.y += velocityY;
    if (this.bird.position.y >= 5 || this.bird.position.y < -4)
      this.isDead = true;
  }

  // set the pipe
  setPipes(topPipe: THREE.Mesh, bottomPipe: THREE.Mesh) {
    this.pipes = [];
    this.pipes[0] = topPipe;
    this.pipes[1] = bottomPipe;
  }

  // mutate the AI
  mutate() {
    this.brain.mutate(0.1);
  }

  // get the AI model
  getModel() {
    return this.brain.getModel();
  }

  // Gett fitness
  getFitness(): number {
    return this.fitness;
  }

  // set the fittness
  setFitness(birdFitness: number) {
    this.fitness = birdFitness;
  }

  // get the brain of the bird
  getBirdBrain(): NeuralNetwork {
    return this.brain;
  }

  // gett the score
  getScore(): number {
    return this.score;
  }

  // scale a number to between
  scale(
    num: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ): number {
    return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  // make the AII move up
  setMoveUp(up: boolean) {
    this.moveUp = up;
  }
  // gett the AI to move up
  getMoveUp(): boolean {
    return this.moveUp;
  }
  // add score
  addScore() {
    this.score++;
  }

  // if tthe bird is marked as dead
  getIsDead(): boolean {
    return this.isDead;
  }

  // AI determines if itt should move up or not
  newLook(topPipe: THREE.Mesh, bottomPipe: THREE.Mesh) {
    if (typeof topPipe === "undefined" || typeof bottomPipe === "undefined")
      return;

    let topPipePosition: THREE.Vector3 = topPipe.position;
    let bottomPipePosition: THREE.Vector3 = bottomPipe.position;

    let topPipeGeometry: THREE.BoxGeometry = topPipe.geometry;
    let bottomPipeGeometry: THREE.BoxGeometry = bottomPipe.geometry;

    let topPipeWidth: number = topPipeGeometry.parameters.width;
    let topPipeHeight: number = topPipeGeometry.parameters.height;
    let topPipeDepth: number = topPipeGeometry.parameters.depth;
    let bottomPipeWidth: number = bottomPipeGeometry.parameters.width;
    let bottomPipeHeight: number = bottomPipeGeometry.parameters.height;
    let bottomPipeDepth: number = bottomPipeGeometry.parameters.depth;

    // Botttom Pipe
    const corner1 = new THREE.Vector3(
      topPipeWidth / 2 - topPipePosition.x,
      topPipeHeight / 2 + topPipePosition.y,
      topPipeDepth / 2 + topPipePosition.z
    );
    const corner2 = new THREE.Vector3(
      topPipeWidth / 2 + topPipePosition.x,
      topPipeHeight / 2 + topPipePosition.y,
      topPipeDepth / 2 + topPipePosition.z
    );
    const corner3 = new THREE.Vector3(
      topPipeWidth / 2 - topPipePosition.x,
      topPipeHeight / 2 + topPipePosition.y,
      topPipeDepth / 2 - topPipePosition.z
    );
    const corner4 = new THREE.Vector3(
      topPipeWidth / 2 + topPipePosition.x,
      topPipeHeight / 2 + topPipePosition.y,
      topPipeDepth / 2 - topPipePosition.z
    );

    // Top Pipe
    const corner5 = new THREE.Vector3(
      bottomPipeWidth / 2 - bottomPipePosition.x,
      bottomPipeHeight / 2 - bottomPipePosition.y,
      bottomPipeDepth / 2 + bottomPipePosition.z
    );
    const corner6 = new THREE.Vector3(
      bottomPipeWidth / 2 + bottomPipePosition.x,
      bottomPipeHeight / 2 - bottomPipePosition.y,
      bottomPipeDepth / 2 + bottomPipePosition.z
    );
    const corner7 = new THREE.Vector3(
      bottomPipeWidth / 2 - bottomPipePosition.x,
      bottomPipeHeight / 2 - bottomPipePosition.y,
      bottomPipeDepth / 2 - bottomPipePosition.z
    );
    const corner8 = new THREE.Vector3(
      bottomPipeWidth / 2 + bottomPipePosition.x,
      bottomPipeHeight / 2 - bottomPipePosition.y,
      bottomPipeDepth / 2 - bottomPipePosition.z
    );

    let inputs: Array<number> = [];

    // https://threejs.org/docs/#api/en/math/Vector3.manhattanDistanceTo
    inputs[0] = this.scale(
      this.bird.position.manhattanDistanceTo(corner1),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[1] = this.scale(
      this.bird.position.manhattanDistanceTo(corner2),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[2] = this.scale(
      this.bird.position.manhattanDistanceTo(corner3),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[3] = this.scale(
      this.bird.position.manhattanDistanceTo(corner4),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[4] = this.scale(
      this.bird.position.manhattanDistanceTo(corner5),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[5] = this.scale(
      this.bird.position.manhattanDistanceTo(corner6),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[6] = this.scale(
      this.bird.position.manhattanDistanceTo(corner7),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[7] = this.scale(
      this.bird.position.manhattanDistanceTo(corner8),
      this.bird.position.y,
      window.innerWidth,
      0,
      1
    );

    inputs[8] = this.scale(
      this.bird.position.x,
      window.innerHeight,
      window.innerWidth,
      0,
      1
    );

    inputs[9] = 0.1;

    let output: Array<number> = [];

    output = this.brain.predict(inputs);

    this.moveUp = false;
    if (output[0] < output[1]) this.moveUp = true;
  }
}
