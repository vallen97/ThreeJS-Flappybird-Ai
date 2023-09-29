import * as THREE from "three";

// Custom type for colors
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

export default class Pipe {
  public readonly pipe: any;
  private readonly velocity = new THREE.Vector3();

  private color: Color = "#528a2c";

  private isDead: boolean = false;

  constructor(width: number, height: number, depth: number) {
    // create the pipe
    const geometry = new THREE.BoxGeometry(width, height, depth);
    // add color to the pipe
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    // add the pipe into a variable
    this.pipe = new THREE.Mesh(geometry, material);
  }

  // if the pipe should be deleted
  getShouldRemove() {
    return this.isDead;
  }

  // sett the speed of the pipe
  setVelocity(x: number, y: number, z: number) {
    this.velocity.set(x, y, z);
  }
  // set the position of the pipe
  setPosition(x: number, y: number, z: number) {
    this.pipe.position.x = x;
    this.pipe.position.y = y;
    this.pipe.position.z = z;
  }

  // move the pipe
  update(speed: number) {
    // add speed to the pipe
    this.pipe.position.x -= speed;
    // if too far to the left, mark as is dead
    if (this.pipe.position.x <= -15) this.isDead = true;
    // if not make as alive
    else this.isDead = false;
  }

  // get ttthe pipe
  getPipe(): THREE.Mesh {
    return this.pipe;
  }

  //  get the pipe posititon on the x axis
  getPipeX(): number {
    return this.pipe.position.x;
  }
  // return if the pipe should be deleted
  setShouldRemove(shouldRemove: boolean) {
    this.isDead = shouldRemove;
  }
}
