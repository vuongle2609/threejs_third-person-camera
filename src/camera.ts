import * as THREE from "three";
import { Vector3 } from "three";
import {
  CAMERA_FAR_FROM_CHARACTER,
  CAMERA_HEIGHT_FROM_CHARACTER,
  CAMERA_LERP_ALPHA,
  CAMERA_ROTATION,
} from "./configs/constants";

export default class Camera_movement {
  camera: THREE.PerspectiveCamera;
  character: THREE.Object3D;

  constructor(character: THREE.Object3D, camera: THREE.PerspectiveCamera) {
    this.character = character;
    this.camera = camera;

    this.camera.rotation.set(CAMERA_ROTATION, 0, 0);
    this.updateNewPosition(true);
  }

  updateNewPosition(test: boolean) {
    if (!test) {
      this.camera.position.lerp(
        new Vector3(
          this.character?.position.x || 0,
          this.character?.position.y || 0 + CAMERA_HEIGHT_FROM_CHARACTER,
          this.character?.position.z || 0 + CAMERA_FAR_FROM_CHARACTER
        ),
        CAMERA_LERP_ALPHA
      );
      return;
    }

    this.camera.position.add(
      new Vector3(
        this.character?.position.x || 0,
        this.character?.position.y || 0 + CAMERA_HEIGHT_FROM_CHARACTER,
        this.character?.position.z || 0 + CAMERA_FAR_FROM_CHARACTER
      )
    );
  }

  update() {
    // this.updateNewPosition();
  }
}
