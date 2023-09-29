import * as THREE from "three";

// Custom type for colors
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;
export default class Bird {
  private birdColor: Color = "#F9DC35";

  private readonly bird: THREE.Mesh;

  constructor() {
    // make the bird
    const geometry = new THREE.SphereGeometry(1.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: this.birdColor });
    this.bird = new THREE.Mesh(geometry, material);
    // set the position
    this.bird.position.x = -7.5;
    this.bird.position.y = 0;
    this.bird.position.z = -10;
  }

  // return the bird
  getBird(): THREE.Mesh {
    return this.bird;
  }

  // move the bird up or down
  update(moveUp: boolean, gravity: number = 0.1): boolean {
    let velocityY = 0;
    if (moveUp) {
      velocityY = gravity * 2.5;
      moveUp = false;
    } else {
      velocityY = gravity * -0.1;
    }
    this.bird.position.y += velocityY;
    return moveUp;
  }
}
