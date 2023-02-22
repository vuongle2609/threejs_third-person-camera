import * as THREE from "three";
import { Quaternion, Vector3 } from "three";
import {
  CAMERA_FAR_FROM_CHARACTER,
  CAMERA_HEIGHT_FROM_CHARACTER,
  CAMERA_LERP_ALPHA,
  CAMERA_ROTATION_OFFSET_CHARACTER,
} from "./configs/constants";

export default class Camera_movement {
  camera: THREE.PerspectiveCamera;
  character: THREE.Object3D;
  currentPosition: THREE.Vector3;
  currentLookat: THREE.Vector3;

  constructor(character: THREE.Object3D, camera: THREE.PerspectiveCamera) {
    this.character = character;
    this.camera = camera;

    this.currentPosition = new THREE.Vector3();
    this.currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(0, 20, -30);
    idealOffset.applyQuaternion(
      new Quaternion().setFromEuler(this.character.rotation.clone())
    );
    idealOffset.add(this.character.position.clone());
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 0, 16);
    idealLookat.applyQuaternion(
      new Quaternion().setFromEuler(this.character.rotation.clone())
    );
    idealLookat.add(this.character.position.clone());
    return idealLookat;
  }

  updateNewPosition(deltaT: number) {
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    const t = 1.0 - Math.pow(0.001, deltaT);

    const t1 = 1;

    this.currentPosition.lerp(idealOffset, t1);
    this.currentLookat.lerp(idealLookat, t1);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookat);

    // const { x, y, z } = this.character.position;

    // this.camera.lookAt(new Vector3(x, y, z + CAMERA_ROTATION_OFFSET_CHARACTER));

    // this.camera.position.lerp(
    //   new Vector3(
    //     x || 0,
    //     (y || 0) + CAMERA_HEIGHT_FROM_CHARACTER,
    //     (z || 0) - CAMERA_FAR_FROM_CHARACTER
    //   ),
    //   CAMERA_LERP_ALPHA
    // );
  }

  update(deltaT: number) {
    this.updateNewPosition(deltaT);
  }
}
