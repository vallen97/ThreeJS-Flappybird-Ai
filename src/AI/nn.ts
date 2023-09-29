// import * as tf from "@tensorflow/tfjs";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export class NeuralNetwork {
  private model: any;
  private input_nodes: any;
  private hidden_nodes: any;
  private output_nodes: any;

  constructor(a: any, b: any, c: any, d?: any) {
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.input_nodes = b;
      this.hidden_nodes = c;
      this.output_nodes = d;
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;
      this.model = this.createModel();
    }
  }

  copy() {
    return tf.tidy((): any => {
      const modelCopy: tf.Sequential = this.createModel();
      const weights: tf.Tensor[] = this.model.getWeights();
      const weightCopies: tf.Tensor[] = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(
        modelCopy,
        this.input_nodes,
        this.hidden_nodes,
        this.output_nodes
      );
    });
  }

  // copy(secondModel: tf.Sequential, Savedmodel?: tf.Sequential) {
  //   let modelCopy: tf.Sequential = null;
  //   // memory management
  //   tf.tidy(() => {
  //     // create model
  //     modelCopy = this.createModel();

  //     console.log('modelCopy: ', modelCopy);

  //     // get weights
  //     let weights: tf.Tensor[];
  //     let secondWeights: tf.Tensor[];
  //     if (Savedmodel) {
  //       weights = Savedmodel.getWeights();
  //     } else {
  //       weights = this.model.getWeights();
  //       if (secondModel != null || typeof secondModel == 'undefined') {
  //         secondWeights = secondModel.getWeights();
  //       }
  //     }

  //     const weightCopies = [];
  //     // make copy of all weights
  //     // Merge two best snakes
  //     if (secondModel != null) {
  //       let i: number = 0;

  //       while (i < weights.length) {
  //         if (i < weights.length / 2) {
  //           weightCopies[i] = weights[i].clone();
  //         } else {
  //           weightCopies[i] = secondWeights[i].clone();
  //         }
  //         i++;
  //       }
  //     } else {
  //       // copy best snake
  //       for (let i = 0; i < weights.length; i++) {
  //         weightCopies[i] = weights[i].clone();
  //       }
  //     }
  //     // set weight into copy
  //     modelCopy.setWeights(weightCopies);
  //   });

  //   // return a new neural network
  //   return new NeuralNetwork(
  //     modelCopy,
  //     this.input_nodes,
  //     this.hidden_nodes,
  //     this.output_nodes
  //   );
  // }

  mutate(rate: number) {
    // memory management
    tf.tidy(() => {
      // get weights
      const weights: tf.Tensor[] = this.model.getWeights();
      const mutatedWeights = [];
      // loop through all weights
      for (let i = 0; i < weights.length; i++) {
        // weights and weight shape
        let tensor = weights[i];
        let shape = weights[i].shape;
        // get values from tensor
        let values = tensor.dataSync().slice();
        // loop through weights
        for (let j = 0; j < values.length; j++) {
          // random number compared to mutate rate
          if (Math.random() < rate) {
            // mutate
            let w = values[j];
            values[j] = w + (2 * Math.random() - 1);
          }
        }
        // make new tensor
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      // set mutated weights
      this.model.setWeights(mutatedWeights);
    });
  }

  // memory management
  dispose() {
    this.model.dispose();
  }

  async save(type: number) {
    let saveResult: any;
    // save in browser or download JSON to users computer
    switch (type) {
      case 0:
        saveResult = await this.model.save('localstorage://best_snake');
        break;
      case 1:
        saveResult = await this.model.save('downloads://best_snake');
        break;
      default:
        break;
    }
  }

  predict(inputs: Array<number>) {
    // memory management
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs: any = ys.dataSync();
      return outputs;
    });
  }

  createModel() {
    // make tensor
    const model = tf.sequential();
    // make hidden and input nodes for neural network
    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.input_nodes],
      activation: 'sigmoid', // all hidden values are between 0-1
    });
    // add hidden and input nodes to model
    model.add(hidden);
    // make output nodes
    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: 'softmax', // all output values equal to 1
    });
    // add output nodes to model
    model.add(output);
    // return model
    return model;
  }

  getModel() {
    return this.model;
  }
  getWeight() {
    return this.model.getWeights();
  }
}
