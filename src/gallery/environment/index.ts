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
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SRGBColorSpace,
  Texture,
  PlaneGeometry,
  Material,
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
   * Load all scene objects
   */
  private async _loadScenes() {
    try {
      await this._loadSceneAndCollisionDetection();
      // await this._loadStaticScene(); // REMOVED: Bỏ ghế sofa, bàn, đồ trang trí
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

  // Load board textures
  private async _loadBoardsTexture(): Promise<void> {
    const boardsToLoad = 10;

    for (let i = 0; i < boardsToLoad; i++) {
      this.texture_boards[i + 1] = await this.loader.texture_loader.loadAsync(
        BOARD_TEXTURES[i]
      );
    }

    for (const key in this.texture_boards) {
      const texture = this.texture_boards[key];
      texture.colorSpace = SRGBColorSpace;
      this._scaleTexture(texture);
    }
  }

  private _scaleTexture(texture: Texture) {
    const image = texture.image as HTMLImageElement;
    const aspectRatio = image.width / image.height;
    const [scaleX, scaleY] =
      aspectRatio > 1 ? [1 / aspectRatio, 1] : [1, aspectRatio];

    texture.offset.set(0.5 - scaleX / 2, 0.5 - scaleY / 2);
    texture.repeat.set(scaleX, scaleY);
    texture.needsUpdate = true;
  }

  // Configure gallery boards
  private _configureGallery() {
    for (const key in this.texture_boards) {
      const board = this.gallery_boards[`gallery${key}_board`];
      if (!board) continue;

      const boardKey = parseInt(key) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      const boardInfo = BOARDS_INFO[boardKey];
      const image = this.texture_boards[key].image as HTMLImageElement;

      (board.material as MeshBasicMaterial).map = this.texture_boards[key];

      board.userData = {
        name: board.name,
        ...boardInfo,
        index: key,
        src: image.src,
        show_boards: true,
      };

      (board.material as MeshBasicMaterial).needsUpdate = true;
    }
  }

  private _createSpecularReflection() {
    // DISABLED: Tắt sàn phản chiếu để bỏ bóng
    // const mirror = new Reflector(new PlaneGeometry(100, 100), {
    //   textureWidth: window.innerWidth * window.devicePixelRatio,
    //   textureHeight: window.innerHeight * window.devicePixelRatio,
    //   color: 0xffffff,
    // });
    // if (mirror.material instanceof Material) {
    //   mirror.material.transparent = true;
    // }
    // mirror.rotation.x = -0.5 * Math.PI;
    // this.core.scene.add(mirror);
  }

  private _loadKarlMarxModel(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        KARL_MARX_MODEL_URL,
        (gltf: any) => {
          const marxModel = gltf.scene;
          marxModel.position.set(0, 0, 28);
          marxModel.scale.set(0.5, 0.5, 0.5);

          marxModel.traverse((item: any) => {
            if (isMesh(item)) {
              item.castShadow = false;
              item.receiveShadow = false;
            }
            this.raycast_objects.push(item);
          });

          this.core.scene.add(marxModel);
          resolve();
        },
        (event: any) => {
          this.core.$emit(ON_LOAD_PROGRESS, {
            url: KARL_MARX_MODEL_URL,
            loaded: event.loaded,
            total: event.total,
          });
        },
        (error: any) => {
          console.error('Error loading Karl Marx model:', error);
          resolve();
        }
      );
    });
  }

  private _loadStaticScene(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        STATIC_SCENE_URL,
        (gltf: any) => {
          this.core.scene.add(gltf.scene);
          resolve();
        },
        (event: any) => {
          this.core.$emit(ON_LOAD_PROGRESS, {
            url: STATIC_SCENE_URL,
            loaded: event.loaded,
            total: event.total,
          });
        }
      );
    });
  }

  private _loadSceneAndCollisionDetection(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        COLLISION_SCENE_URL,
        (gltf: any) => {
          this.collision_scene = gltf.scene;

          if (!this.collision_scene) return resolve();

          this.collision_scene.updateMatrixWorld(true);

          const itemsToRemove: any[] = [];

          this.collision_scene.traverse((item: any) => {
            // Bỏ ghế sofa, bàn học, cây cảnh và các object không cần thiết
            const removeNames = [
              'sofa',
              'desk',
              'chair',
              'table',
              'plant',
              'cube',
              'plane',
              'object',
              'mesh',
            ];
            const shouldRemove = removeNames.some((name) =>
              item.name?.toLowerCase().includes(name.toLowerCase())
            );

            if (shouldRemove) {
              item.visible = false;
              if (item.castShadow !== undefined) item.castShadow = false;
              if (item.receiveShadow !== undefined) item.receiveShadow = false;
              itemsToRemove.push(item);
              return;
            }

            if (item.name === 'home001' || item.name === 'PointLight') {
              item.castShadow = false;
            }

            if (item.name?.includes('PointLight') && isLight(item)) {
              item.intensity *= 2000;
              item.castShadow = false;
            }

            if (item.name === 'home002') {
              item.castShadow = false;
              item.receiveShadow = false;
            }

            if (
              item.name &&
              /gallery([1-9]|10)_board/.test(item.name) &&
              isMesh(item)
            ) {
              this.gallery_boards[item.name] = item;
            }

            this.raycast_objects.push(item);
          });

          // Xóa objects NGAY sau khi traverse xong, TRƯỚC KHI tạo collision
          itemsToRemove.forEach((item) => {
            if (item.parent) {
              item.parent.remove(item);
            }
          });

          const static_generator = new StaticGeometryGenerator(
            this.collision_scene
          );
          static_generator.attributes = ['position'];

          const merged_geometry = static_generator.generate();
          (merged_geometry as any).boundsTree = new MeshBVH(merged_geometry, {
            lazyGeneration: false,
          } as MeshBVHOptions);

          this.collider = new Mesh(merged_geometry);
          this.core.scene.add(this.collision_scene);

          resolve();
        },
        (event: any) => {
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
