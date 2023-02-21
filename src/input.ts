export default class BasicCharacterControllerInput {
  keys: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    shift: boolean;
  };
  constructor() {
    this.initialize();
  }

  initialize() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };

    document.addEventListener("keydown", (e) => this.onKeydown(e), false);
    document.addEventListener("keyup", (e) => this.onKeyup(e), false);
  }

  onKeydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 32: // space
        this.keys.space = true;
        break;
      case 16: // shift
        this.keys.shift = true;
        break;
    }
  }

  onKeyup(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 32: // space
        this.keys.space = false;
        break;
      case 16: // shift
        this.keys.shift = false;
        break;
    }
  }
}
