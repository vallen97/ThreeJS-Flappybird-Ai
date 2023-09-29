import * as THREE from "three";

// Custom color type
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

export default class Pipe {
  // make pipe
  public readonly pipe: any;
  private color: Color = "#528a2c";

  // variables of for the pipe
  private readonly velocity = new THREE.Vector3();
  private isDead: boolean = false;

  constructor(width: number, height: number, depth: number) {
    // creates and sets the pipe
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    this.pipe = new THREE.Mesh(geometry, material);
  }

  // if the pipe is marked as is dead
  getShouldRemove() {
    return this.isDead;
  }

  // set move
  setVelocity(x: number, y: number, z: number) {
    this.velocity.set(x, y, z);
  }

  // set position
  setPosition(x: number, y: number, z: number) {
    this.pipe.position.x = x;
    this.pipe.position.y = y;
    this.pipe.position.z = z;
  }

  // move the pipe
  update(speed: number) {
    this.pipe.position.x -= speed;
    // if pipe is too far left mark as dead
    if (this.pipe.position.x <= -15) this.isDead = true;
    else this.isDead = false;
  }

  // get the pipe
  getPipe(): THREE.Mesh {
    return this.pipe;
  }

  // gett pipe x axis
  getPipeX(): number {
    return this.pipe.position.x;
  }

  // set should remove
  setShouldRemove(shouldRemove: boolean) {
    this.isDead = shouldRemove;
  }
}
