import Core from '../core';
import Loader from '../loader';
import {
  BOARD_TEXTURES,
  BOARDS_INFO,
  COLLISION_SCENE_URL,
  KARL_MARX_MODEL_URL,
  ON_LOAD_MODEL_FINISH,
  ON_LOAD_PROGRESS,
  STATIC_SCENE_URL,
} from '../Constants';
import {
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SRGBColorSpace,
  Texture,
  PlaneGeometry,
} from 'three';
import { isLight, isMesh } from '../utils/typeAssert';
import {
  MeshBVH,
  MeshBVHOptions,
  StaticGeometryGenerator,
} from 'three-mesh-bvh';
import { Reflector } from '../lib/Reflector';

export default class Environment {
  private core: Core;
  private loader: Loader;
  private collision_scene: Group | undefined;
  collider: Mesh | undefined;
  private texture_boards: Record<string, Texture> = {};
  private gallery_boards: Record<string, Mesh> = {};
  raycast_objects: Object3D[] = [];
  is_load_finished = false;

  constructor() {
    this.core = new Core();
    this.loader = this.core.loader;
    this._loadScenes();
  }

  /*
   * Load all scene objects (map, frames and textures, floor reflection)
   * */
  private async _loadScenes() {
    try {
      await this._loadSceneAndCollisionDetection();
      await this._loadStaticScene();
      await this._loadKarlMarxModel();
      await this._loadBoardsTexture();
      this._configureGallery();
      this._createSpecularReflection();
      this.is_load_finished = true;
      this.core.$emit(ON_LOAD_MODEL_FINISH);
    } catch (e) {
      console.log(e);
    }
  }

  private async _loadBoardsTexture(): Promise<void> {
    for (let i = 0; i < BOARD_TEXTURES.length; i++) {
      this.texture_boards[i + 1] = await this.loader.texture_loader.loadAsync(
        BOARD_TEXTURES[i]
      );
    }

    for (const key in this.texture_boards) {
      const texture = this.texture_boards[key];
      texture.colorSpace = SRGBColorSpace;

      // Calculate scaling ratio based on texture aspect ratio
      const texture_aspect_ratio = texture.image.width / texture.image.height;
      let scale_x = 1;
      let scale_y = 1;

      if (texture_aspect_ratio > 1) {
        scale_x = 1 / texture_aspect_ratio;
      } else {
        scale_y = texture_aspect_ratio;
      }

      // Set texture offset and repeat for centering and fitting
      texture.offset.set(0.5 - scale_x / 2, 0.5 - scale_y / 2);
      texture.repeat.set(scale_x, scale_y);
      texture.needsUpdate = true;
    }

    return Promise.resolve();
  }

  /*
   * Set board userData and flip textures
   * */
  private _configureGallery() {
    for (const key in this.texture_boards) {
      const board = this.gallery_boards[`gallery${key}_board`];
      const board_material = board.material;
      (board_material as MeshBasicMaterial).map = this.texture_boards[key];
      board.userData = {
        name: board.name,
        title: BOARDS_INFO[key].title,
        author: BOARDS_INFO[key].author,
        describe: BOARDS_INFO[key].describe,
        index: key,
        src: this.texture_boards[key].image.src,
        show_boards: true,
      };

      // Flip textures
      if ([4, 5, 6, 7, 9].includes(+key)) {
        board.rotation.y = -Math.PI / 2;
      }
      if (8 === +key) {
        board.rotation.y = Math.PI;
      }

      (board_material as MeshBasicMaterial).needsUpdate = true;
    }
  }

  /*
   * Create floor mirror reflection
   * */
  private _createSpecularReflection() {
    const mirror = new Reflector(new PlaneGeometry(100, 100), {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0xffffff,
    });
    if (mirror.material instanceof Material) {
      mirror.material.transparent = true;
    }
    mirror.rotation.x = -0.5 * Math.PI;
    this.core.scene.add(mirror);
  }

  /*
   * Load Karl Marx statue model
   * */
  private _loadKarlMarxModel(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        KARL_MARX_MODEL_URL,
        (gltf) => {
          const marxModel = gltf.scene;

          // Position the statue in the gallery (adjust as needed)
          marxModel.position.set(0, 0, 0);
          marxModel.scale.set(1, 1, 1);

          // Add to collision scene for interactions
          marxModel.traverse((item) => {
            if (isMesh(item)) {
              item.castShadow = true;
              item.receiveShadow = true;
            }
            // Add to raycast objects for interactions
            this.raycast_objects.push(item);
          });

          // Add model to scene
          this.core.scene.add(marxModel);
          resolve();
        },
        (event) => {
          this.core.$emit(ON_LOAD_PROGRESS, {
            url: KARL_MARX_MODEL_URL,
            loaded: event.loaded,
            total: event.total,
          });
        },
        (error) => {
          console.error('Error loading Karl Marx model:', error);
          resolve(); // Resolve anyway to not block other loading
        }
      );
    });
  }

  /*
   * Load static scene without collision
   * */
  private _loadStaticScene(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        STATIC_SCENE_URL,
        (gltf) => {
          this.core.scene.add(gltf.scene);
          gltf.scene.traverse((item) => {
            if (item.name === 'computer') {
              item.userData = {
                name: item.name,
                title: 'Oh, the distance 🏕',
              };
              this.raycast_objects.push(item);
            }
          });
          resolve();
        },
        (event) => {
          this.core.$emit(ON_LOAD_PROGRESS, {
            url: STATIC_SCENE_URL,
            loaded: event.loaded,
            total: event.total,
          });
        }
      );
    });
  }

  /*
   * Load scene with collision detection
   * */
  private _loadSceneAndCollisionDetection(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        COLLISION_SCENE_URL,
        (gltf) => {
          this.collision_scene = gltf.scene;

          this.collision_scene.updateMatrixWorld(true);

          this.collision_scene.traverse((item) => {
            if (item.name === 'home001' || item.name === 'PointLight') {
              item.castShadow = true;
            }

            if (item.name.includes('PointLight') && isLight(item)) {
              item.intensity *= 2000;
            }

            if (item.name === 'home002') {
              item.castShadow = true;
              item.receiveShadow = true;
            }

            // Extract frame elements
            if (/gallery.*_board/.test(item.name) && isMesh(item)) {
              this.gallery_boards[item.name] = item;
            }

            this.raycast_objects.push(item);
          });

          const static_generator = new StaticGeometryGenerator(
            this.collision_scene
          );
          static_generator.attributes = ['position'];

          const merged_geometry = static_generator.generate();
          merged_geometry.boundsTree = new MeshBVH(merged_geometry, {
            lazyGeneration: false,
          } as MeshBVHOptions);

          this.collider = new Mesh(merged_geometry);
          this.core.scene.add(this.collision_scene);

          resolve();
        },
        (event) => {
          this.core.$emit(ON_LOAD_PROGRESS, {
            url: COLLISION_SCENE_URL,
            loaded: event.loaded,
            total: event.total,
          });
        }
      );
    });
  }
}
