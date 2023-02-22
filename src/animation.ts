import { AnimationAction } from "three";
import BasicCharacterControllerInput from "./input";
import { CharacterAnimationType } from "./type";

interface PropsType {
  animations: CharacterAnimationType;
  input: BasicCharacterControllerInput;
}
export default class Character_animation {
  animations: CharacterAnimationType;
  input: BasicCharacterControllerInput;
  prevAction: {
    name: string | undefined;
    action: AnimationAction | undefined;
  };
  currentAction: {
    name: string | undefined;
    action: AnimationAction | undefined;
  };

  constructor({ animations, input }: PropsType) {
    this.input = input;
    this.animations = animations;
  }

  handleAnimation() {
    const { keys } = this.input;
    const { running, runningBack, jump, leftRun, rightRun, idle } =
      this.animations;

    if (keys.left) {
      this.currentAction = {
        name: "leftRun",
        action: leftRun,
      };
    } else if (keys.right) {
      this.currentAction = {
        name: "rightRun",
        action: rightRun,
      };
    } else if (keys.forward) {
      this.currentAction = {
        name: "running",
        action: running,
      };
    } else if (keys.backward) {
      this.currentAction = {
        name: "runningBack",
        action: runningBack,
      };
    }
    // else if (keys.space) {
    //   this.currentAction = {
    //     name: "jump",
    //     action: jump,
    //   };
    // }
    else {
      this.currentAction = {
        name: "idle",
        action: idle,
      };
    }

    if (this.prevAction) {
      if (
        this.prevAction?.name !== this.currentAction?.name &&
        this.currentAction?.action
      ) {
        // this.currentAction.action.time = 0.0;
        this.currentAction.action.enabled = true;
        this.currentAction.action.setEffectiveTimeScale(1.0);
        this.currentAction.action.setEffectiveWeight(1.0);

        this.currentAction.action.crossFadeFrom(
          this.prevAction.action as AnimationAction,
          0.3,
          true
        );
        this.currentAction?.action?.play();
      }
    } else {
      this.currentAction?.action?.play();
    }

    this.prevAction = this.currentAction;
  }

  update(deltaT: number) {
    this.handleAnimation();
  }
}
