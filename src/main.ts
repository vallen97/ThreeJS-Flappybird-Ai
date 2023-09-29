// import * as tf from "@tensorflow/tfjs";
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import FlappyBirdsGameScene from "./flappyBirdsGame/mainGameScene";
import FlappyBirdsAIGameScene from "./flappyBirdsAi/mainGameScene";

const fps = 45;
console.log(
  "Todo:\n",
  "Have buttons to either ",
  "play the game or let the AI play\n",
  "Also add webGL or use the gpu first, CPU second\n"
);

// Start threeJS using webgl or not
if (WebGL.isWebGLAvailable()) {
  // animate();
  console.log("use webGL");
} else {
  const warning = WebGL.getWebGLErrorMessage();

  console.log("Warning: ", warning);
}

// function animate() {
//   // Dimensions of the window
//   const width = window.innerWidth;
//   const height = window.innerHeight;

//   // Get the app id canvas element
//   const renderer = new THREE.WebGL1Renderer({
//     canvas: document.getElementById("app") as HTMLCanvasElement,
//   });

//   // set the size tto the window
//   renderer.setSize(width, height);

//   // make the camera
//   const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);

//   // add the camera to the scene
//   const scene = new AIFlappyBirds(mainCamera);
//   //  sttart the flappy birds game
//   scene.initialize();

//   // make aure that the game is continuously running
//   function tick() {
//     // make sure that the scene doesn't have an upcapped FPS
//     setTimeout(() => {
//       // update the scene
//       scene.update();
//       // render the scene
//       renderer.render(scene, mainCamera);
//       // run the tick function again
//       requestAnimationFrame(tick);
//     }, 1000 / fps);
//   }
//   // call tick to run the game
//   tick();
// }

document.getElementById("btn-play").addEventListener("click", startGame);

function startGame() {
  // Dimensions of the window
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Get the app id canvas element
  const renderer = new THREE.WebGL1Renderer({
    canvas: document.getElementById("app") as HTMLCanvasElement,
  });

  // set the size tto the window
  renderer.setSize(width, height);

  // make the camera
  const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);

  // add the camera to the scene
  const scene = new FlappyBirdsGameScene(mainCamera);
  //  sttart the flappy birds game
  scene.initialize();

  // make aure that the game is continuously running
  function tick() {
    // make sure that the scene doesn't have an upcapped FPS
    setTimeout(() => {
      // update the scene
      scene.update();
      // render the scene
      renderer.render(scene, mainCamera);
      // run the tick function again
      requestAnimationFrame(tick);
    }, 1000 / fps);
  }
  // call tick to run the game
  tick();
}

document.getElementById("btn-play-ai").addEventListener("click", stratAI);

function stratAI() {
  // Dimensions of the window
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Get the app id canvas element
  const renderer = new THREE.WebGL1Renderer({
    canvas: document.getElementById("app") as HTMLCanvasElement,
  });

  // set the size tto the window
  renderer.setSize(width, height);

  // make the camera
  const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);

  // add the camera to the scene
  const scene = new FlappyBirdsAIGameScene(mainCamera);
  //  sttart the flappy birds game
  scene.initialize();

  // make aure that the game is continuously running
  function tick() {
    // make sure that the scene doesn't have an upcapped FPS
    setTimeout(() => {
      // update the scene
      scene.update();
      // render the scene
      renderer.render(scene, mainCamera);
      // run the tick function again
      requestAnimationFrame(tick);
    }, 1000 / fps);
  }
  // call tick to run the game
  tick();
}
