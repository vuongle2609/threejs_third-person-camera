import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import "toastr/build/toastr.min.css";
import Camera_movement from "./camera.js";
import { ASPECT, FAR, FOV, NEAR, SPEED } from "./configs/constants";
import Character_control from "./control";
import Light from "./light";
import { GUI } from "dat.gui";
import { AnimationAction } from "three";
class Game {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  control: OrbitControls;
  stats: Stats;
  character_control: Character_control;
  camera_movement: Camera_movement;
  lastTime: number;
  clock: THREE.Clock;
  character: THREE.Object3D;
  characterBB: THREE.Box3;
  wallsBB: THREE.Box3[] = [];
  characterMixer: THREE.AnimationMixer;

  characterAnimation: {
    runningBack: THREE.AnimationAction | undefined;
    walking: THREE.AnimationAction | undefined;
    idle: THREE.AnimationAction | undefined;
    jump: THREE.AnimationAction | undefined;
    leftRun: THREE.AnimationAction | undefined;
    rightRun: THREE.AnimationAction | undefined;
  } = {
    runningBack: undefined,
    walking: undefined,
    idle: undefined,
    jump: undefined,
    leftRun: undefined,
    rightRun: undefined,
  };

  constructor() {
    this.initialize();
  }

  initialize() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2.3;

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#DEF5E5");
    this.scene.add(new THREE.AxesHelper(200));

    this.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);

    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    // this.control.dispose();

    new Light(this.scene);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshPhongMaterial({ color: 0xffe9b1 })
    );
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.position.set(0, -2, 0);
    plane.receiveShadow = true;
    this.scene.add(plane);

    const wallsArray = [
      {
        position: [0, 3, -20],
        size: [40, 10, 2],
        rotation: [0, 0, 0],
      },
      {
        position: [-20, 3, 0],
        size: [30, 10, 2],
        rotation: [0, 0, 0],
      },
      {
        position: [-40, 3, -20],
        size: [2, 20, 40],
        rotation: [0, 0, 0],
      },
      {
        position: [40, 3, -20],
        size: [2, 10, 40],
        rotation: [0, 0, 0],
      },
      {
        position: [30, 3, 20],
        size: [2, 10, 40],
        rotation: [0, 0, 0],
      },
      {
        position: [10, 3, 20],
        size: [2, 40, 10],
        rotation: [0, 0, 0],
      },
    ];

    wallsArray.forEach(({ position, size, rotation }) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshPhongMaterial({ color: 0xfffbc1 })
      );

      wall.castShadow = true;
      wall.receiveShadow = true;

      wall.rotation.set(rotation[0], rotation[1], rotation[2]);
      wall.position.set(position[0], position[1], position[2]);

      this.scene.add(wall);

      const wallBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      wallBB.setFromObject(wall);

      this.wallsBB.push(wallBB);
    });

    this.camera_movement = new Camera_movement(this.character, this.camera);

    this.stats = Stats();
    // fps show
    document.body.appendChild(this.stats.dom);

    this.loadModels();

    this.clock = new THREE.Clock();
    this.gameloop(0);
  }

  async loadModels() {
    const fbxLoader = new FBXLoader();

    const character = await fbxLoader.loadAsync("/assets/char.fbx");

    this.character = character;

    character.scale.set(0.04, 0.04, 0.04);
    character.receiveShadow = true;
    character.castShadow = true;

    character.traverse((item) => {
      item.receiveShadow = true;
      item.castShadow = true;
    });

    this.characterMixer = new THREE.AnimationMixer(this.character);

    const onLoad = (name: string, animation: THREE.Group) => {
      console.log("loaded ", name);

      // use for remove change character position behavior
      const animationClip = animation.animations[0];

      const rootBone = character.children[0];
      const tracks = animationClip.tracks;
      const rootTranslationTrackIndex = tracks.findIndex(
        (track) =>
          track.name.endsWith(".position") &&
          track.name.startsWith(rootBone.name)
      );
      if (rootTranslationTrackIndex !== -1) {
        tracks.splice(rootTranslationTrackIndex, 1);
      }

      const newAnimation = this.characterMixer.clipAction(
        animation.animations[0]
      );

      this.characterAnimation[name] = newAnimation;
    };

    const urlsAnimationModels = [
      { url: "/assets/running.fbx", name: "running" },
      { url: "/assets/Running Backward.fbx", name: "runningBack" },
      { url: "/assets/walking.fbx", name: "walking" },
      { url: "/assets/idle.fbx", name: "idle" },
      { url: "/assets/jump.fbx", name: "jump" },
      { url: "/assets/left strafe.fbx", name: "leftRun" },
      { url: "/assets/right strafe.fbx", name: "rightRun" },
    ];

    const animationsModels = await Promise.all(
      urlsAnimationModels.map((item) => fbxLoader.loadAsync(item.url))
    );

    animationsModels.forEach((item, index) => {
      onLoad(urlsAnimationModels[index].name, item);
    });

    this.scene.add(this.character);

    this.characterAnimation.leftRun?.play()

    this.character_control = new Character_control(
      this.character,
      this.control,
      this.camera,
      this.scene
    );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  gameloop(t: number) {
    requestAnimationFrame((t) => {
      this.gameloop(t);
    });

    const deltaT = this.clock.getDelta();

    if (this.characterMixer) {
      this.characterMixer.update(deltaT);
    }
    this.renderer.render(this.scene, this.camera);
    this.character_control?.update(deltaT);
    this.stats.update();
    this.camera_movement.update();
  }
}

new Game();
