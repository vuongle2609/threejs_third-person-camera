import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GRAVITY, JUMP_FORCE, SPEED } from "./configs/constants";
import BasicCharacterControllerInput from "./input";
import MouseControl from "./mouse";

interface PropsType {
  character: THREE.Object3D;
  control: OrbitControls;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  input: BasicCharacterControllerInput;
  mouse: MouseControl;
}

export default class Character_control {
  input: BasicCharacterControllerInput;
  character: THREE.Object3D;
  control: OrbitControls;
  currentPosition: Vector3;
  camera: THREE.PerspectiveCamera;
  isJump: boolean;
  velocityY: number = 0;
  airDirection: Vector3 | null;
  scene: THREE.Scene;
  mouse_control: MouseControl;

  constructor({ character, control, camera, scene, input, mouse }: PropsType) {
    this.scene = scene;
    this.camera = camera;
    this.input = input;
    this.control = control;
    this.character = character;
    this.mouse_control = mouse;

    this.currentPosition = new Vector3();
  }

  updateNewPosition(deltaT: number) {
    this.character.rotation.set(
      0,
      6.2832 * -this.mouse_control.mousePercentScreenX,
      0
    );

    const direction = new Vector3().copy(this.currentPosition);

    const frontVector = new Vector3(
      0,
      0,
      (this.input.keys.forward ? 1 : 0) - (this.input.keys.backward ? 1 : 0)
    );

    const sideVector = new Vector3(
      (this.input.keys.left ? 1 : 0) - (this.input.keys.right ? 1 : 0),
      0,
      0
    );

    direction.subVectors(frontVector, sideVector);

    this.currentPosition.copy(this.character.position);

    let gravityVector = new Vector3(0, 0, 0);

    let moveVector = new Vector3(direction.x, 0, direction.z);

    const forwardVector = new Vector3();
    this.character.getWorldDirection(forwardVector);

    forwardVector.y = 0;
    forwardVector.normalize();

    const vectorUp = new Vector3(0, 1, 0);

    const vectorRight = vectorUp.crossVectors(vectorUp, forwardVector);

    const moveVector2 = new Vector3().addVectors(
      forwardVector.multiplyScalar(frontVector.z),
      vectorRight.multiplyScalar(sideVector.x)
    );

    moveVector2.normalize().multiplyScalar(SPEED);

    if (this.input.keys.space && !this.isJump) {
      this.velocityY = JUMP_FORCE;
      this.isJump = true;
    }

    if (this.character.position.y >= 0 && !this.isJump) {
      this.isJump = true;
    }

    gravityVector.y += this.velocityY * deltaT;

    if (this.airDirection) {
      gravityVector.add(
        new Vector3(
          moveVector.x ? 0 : this.airDirection.x,
          this.airDirection.y,
          moveVector.z ? 0 : this.airDirection.z
        )
      );
    }

    this.character.position
      .add(new Vector3(moveVector2.x, 0, moveVector2.z))
      .add(gravityVector);
  }

  update(deltaT: number) {
    if (deltaT > 0.15) {
      deltaT = 0.15;
    }

    this.updateNewPosition(deltaT);
  }
}
