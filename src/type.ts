export interface CharacterAnimationType {
  running: THREE.AnimationAction | undefined;
  runningBack: THREE.AnimationAction | undefined;
  walking: THREE.AnimationAction | undefined;
  idle: THREE.AnimationAction | undefined;
  jump: THREE.AnimationAction | undefined;
  leftRun: THREE.AnimationAction | undefined;
  rightRun: THREE.AnimationAction | undefined;
}
