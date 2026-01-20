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
  MeshStandardMaterial,
  BoxGeometry,
  Object3D,
  SRGBColorSpace,
  Texture,
  PlaneGeometry,
  SpotLight,
  AmbientLight,
  PointLight,
  Color,
  DoubleSide,
} from 'three';
import { isLight, isMesh } from '../utils/typeAssert';
import {
  MeshBVH,
  MeshBVHOptions,
  StaticGeometryGenerator,
} from 'three-mesh-bvh';
import { Reflector } from '../lib/Reflector';

/**
 * =====================================================
 * PROFESSIONAL 3D GALLERY - 6 EXHIBITION ROOMS
 * Layout: Central corridor with 3 rooms left, 3 rooms right
 * =====================================================
 */

export default class Environment {
  private core: Core;
  private loader: Loader;
  private collision_scene: Group | undefined;
  collider: Mesh | undefined;
  private texture_boards: Record<string, Texture> = {};
  private gallery_boards: Record<string, Mesh> = {};
  raycast_objects: Object3D[] = [];
  is_load_finished = false;

  // List of objects to remove - only keep boards/frames and lights
  private readonly OBJECTS_TO_REMOVE = [
    // Furniture
    'sofa',
    'couch',
    'chair',
    'seat',
    'desk',
    'table',
    'counter',
    'bench',
    // Plants & Nature
    'plant',
    'pot',
    'vase',
    'flower',
    'tree',
    'bush',
    'leaf',
    'leaves',
    // Containers & Items
    'cup',
    'mug',
    'glass',
    'bottle',
    'book',
    'shelf',
    'box',
    'container',
    'basket',
    'bin',
    'bag',
    'stack',
    'pile',
    // Electronics
    'computer',
    'laptop',
    'monitor',
    'screen',
    'keyboard',
    'mouse',
    // Decorations
    'decor',
    'decoration',
    'ornament',
    'sculpture',
    'statue',
    'figurine',
    // Lighting (except PointLight)
    'lamp',
    'light_fixture',
    'spotlight',
    'chandelier',
    // Architecture
    'wall',
    'partition',
    'divider',
    'door',
    'window',
    // Floor items
    'carpet',
    'rug',
    'mat',
    'cushion',
    'pillow',
    // Other common objects
    'frame',
    'holder',
    'stand',
    'support',
    'base',
    'object',
    'prop',
    'item',
    'piece',
    'thing',
    'mesh',
    'geometry',
    'model',
    'asset',
  ];

  constructor() {
    this.core = new Core();
    this.loader = this.core.loader;
    this._loadScenes();
  }

  // Helper: Check if object should be removed (AGGRESSIVE MODE)
  private shouldRemoveObject(item: any): boolean {
    // KEEP: boards, ceiling, lights, and essential structure
    if (!item.name) return true; // Remove unnamed objects

    const name = item.name.toLowerCase();

    // KEEP these - essential for scene structure
    if (name.includes('board')) return false;
    if (name.includes('light') && name.includes('point')) return false;
    if (name.includes('home001') || name.includes('home002')) return false;
    if (name.includes('ceiling') || name.includes('roof')) return false;

    // REMOVE brown/wood floors specifically
    if (
      (name.includes('floor') || name.includes('ground')) &&
      (name.includes('brown') || name.includes('wood') || name.includes('dark'))
    ) {
      return true;
    }

    // KEEP white/light floors for collision
    if (name.includes('floor') || name.includes('ground')) return false;

    // REMOVE everything else matching keywords
    return this.OBJECTS_TO_REMOVE.some((keyword) => name.includes(keyword));
  }

  /*
   * Load all scene objects (map, frames and textures, floor reflection)
   * */
  private async _loadScenes() {
    try {
      await this._loadSceneAndCollisionDetection();
      await this._loadKarlMarxModel();
      await this._loadBoardsTexture();

      // Build professional gallery
      this._createProfessionalGallery();
      this._configureArtworks();
      this._createGalleryLighting();
      this._createSpecularReflection();

      this.is_load_finished = true;
      this.core.$emit(ON_LOAD_MODEL_FINISH);
    } catch (e) {
      console.log(e);
    }
  }

  // Load and configure board textures
  private async _loadBoardsTexture(): Promise<void> {
    const boardsToLoad = 6;

    // Load textures
    for (let i = 0; i < boardsToLoad; i++) {
      this.texture_boards[i + 1] = await this.loader.texture_loader.loadAsync(
        BOARD_TEXTURES[i]
      );
    }

    // Configure textures
    for (const key in this.texture_boards) {
      const texture = this.texture_boards[key];
      texture.colorSpace = SRGBColorSpace;
      this._scaleTexture(texture);
    }
  }

  // Helper: Scale texture to fit frame
  private _scaleTexture(texture: Texture) {
    const image = texture.image as HTMLImageElement;
    const aspectRatio = image.width / image.height;
    const [scaleX, scaleY] =
      aspectRatio > 1 ? [1 / aspectRatio, 1] : [1, aspectRatio];

    texture.offset.set(0.5 - scaleX / 2, 0.5 - scaleY / 2);
    texture.repeat.set(scaleX, scaleY);
    texture.needsUpdate = true;
  }

  /**
   * =====================================================
   * CLEAN GALLERY DESIGN - Using existing scene structure
   * 6 artworks displayed along corridor walls
   * Spawn on stairs, walk down to view artworks
   * =====================================================
   */

  // Simple gallery - just place artworks on existing walls
  private _createProfessionalGallery() {
    // No extra walls - use existing scene structure
    // Only add subtle ambient lighting enhancement
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.core.scene.add(ambientLight);
  }

  // Configure artworks - place on walls, 3 left side, 3 right side
  private _configureArtworks() {
    // Layout: 3 artworks on left wall, 3 on right wall
    // Walking from stairs (z=35) towards back (z=-20)
    const artworkConfigs = [
      // LEFT WALL - facing right (rotY = PI/2)
      { x: -18, y: 3.5, z: 20, rotY: Math.PI / 2 }, // Artwork 1 - near stairs
      { x: -18, y: 3.5, z: 5, rotY: Math.PI / 2 }, // Artwork 2 - middle
      { x: -18, y: 3.5, z: -10, rotY: Math.PI / 2 }, // Artwork 3 - far end
      // RIGHT WALL - facing left (rotY = -PI/2)
      { x: 18, y: 3.5, z: 20, rotY: -Math.PI / 2 }, // Artwork 4 - near stairs
      { x: 18, y: 3.5, z: 5, rotY: -Math.PI / 2 }, // Artwork 5 - middle
      { x: 18, y: 3.5, z: -10, rotY: -Math.PI / 2 }, // Artwork 6 - far end
    ];

    for (const key in this.texture_boards) {
      const board = this.gallery_boards[`gallery${key}_board`];
      if (!board) continue;

      const boardKey = parseInt(key) as 1 | 2 | 3 | 4 | 5 | 6;
      const boardInfo = BOARDS_INFO[boardKey];
      const image = this.texture_boards[key].image as HTMLImageElement;
      const index = parseInt(key) - 1;

      if (artworkConfigs[index]) {
        const config = artworkConfigs[index];

        // Apply texture
        (board.material as MeshBasicMaterial).map = this.texture_boards[key];

        // Position artwork on wall
        board.position.set(config.x, config.y, config.z);
        board.rotation.y = config.rotY;

        // Scale artwork - larger for better visibility
        board.scale.set(2, 2, 1);

        // Set metadata
        board.userData = {
          name: board.name,
          ...boardInfo,
          index: key,
          src: image.src,
          show_boards: true,
          roomNumber: index + 1,
        };

        (board.material as MeshBasicMaterial).needsUpdate = true;

        // Add spotlight for each artwork
        this._addArtworkSpotlight(config.x, config.y, config.z, config.rotY);
      }
    }
  }

  // Add spotlight for artwork
  private _addArtworkSpotlight(x: number, y: number, z: number, rotY: number) {
    const spotlight = new SpotLight(0xfff8f0, 3, 12, Math.PI / 5, 0.4, 1);

    // Position light in front of artwork
    const offsetX = rotY > 0 ? 4 : -4;
    spotlight.position.set(x + offsetX, y + 3, z);

    // Point at artwork center
    spotlight.target.position.set(x, y, z);
    spotlight.target.updateMatrixWorld();

    this.core.scene.add(spotlight);
    this.core.scene.add(spotlight.target);
  }

  // Simplified lighting
  private _createGalleryLighting() {
    // Corridor ceiling lights
    const ceilingLights = [
      { x: 0, z: 25 },
      { x: 0, z: 10 },
      { x: 0, z: -5 },
      { x: 0, z: -15 },
    ];

    ceilingLights.forEach((pos) => {
      const light = new PointLight(0xffffff, 1.2, 25);
      light.position.set(pos.x, 5.5, pos.z);
      this.core.scene.add(light);
    });
  }

  /*
   * Create floor mirror reflection - subtle
   * */
  private _createSpecularReflection() {
    const mirror = new Reflector(new PlaneGeometry(60, 80), {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0xeeeeee,
    });
    if (mirror.material instanceof Material) {
      mirror.material.transparent = true;
      mirror.material.opacity = 0.1; // Very subtle reflection
    }
    mirror.rotation.x = -0.5 * Math.PI;
    mirror.position.y = 0.02;
    this.core.scene.add(mirror);
  }

  // Keep for compatibility
  private _configureGallery() {}
  private _createArtworkFrame(x: number, y: number, z: number, rotY: number) {}
  private _createExhibitionRoom(
    x: number,
    z: number,
    side: 'left' | 'right',
    roomNumber: number,
    wallMaterial: MeshStandardMaterial,
    accentWallMaterial: MeshStandardMaterial
  ) {}

  /*
   * Load Karl Marx statue model
   * */
  private _loadKarlMarxModel(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        KARL_MARX_MODEL_URL,
        (gltf: any) => {
          const marxModel = gltf.scene;

          // Position the statue in the gallery
          // X: -20 (bên trái), Y: 0 (trên sàn), Z: 30 (phía sau)
          marxModel.position.set(-20, 0, 30);
          // Scale down to 40% of original size
          marxModel.scale.set(0.4, 0.4, 0.4);

          // Add to collision scene for interactions
          marxModel.traverse((item: any) => {
            if (isMesh(item)) {
              item.castShadow = false; // Disabled
              item.receiveShadow = false; // Disabled
            }
            // Add to raycast objects for interactions
            this.raycast_objects.push(item);
          });

          // Add model to scene
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
          resolve(); // Resolve anyway to not block other loading
        }
      );
    });
  }

  // Load static scene and remove unnecessary objects
  private _loadStaticScene(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        STATIC_SCENE_URL,
        (gltf: any) => {
          this.core.scene.add(gltf.scene);
          this._cleanupScene(gltf.scene);
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

  // Helper: Remove unnecessary objects from scene (AGGRESSIVE)
  private _cleanupScene(scene: any) {
    const toRemove: any[] = [];

    scene.traverse((item: any) => {
      // Remove all objects except boards and essential elements
      if (this.shouldRemoveObject(item)) {
        toRemove.push(item);
      }
    });

    console.log(`Removing ${toRemove.length} objects from static scene`);
    toRemove.forEach((obj) => {
      // Dispose materials and geometries
      if (isMesh(obj)) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
      obj.removeFromParent();
    });

    // Force shadow map update
    if (this.core.renderer) {
      this.core.renderer.shadowMap.needsUpdate = true;
    }
  }

  /*
   * Load scene with collision detection
   * */
  private _loadSceneAndCollisionDetection(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        COLLISION_SCENE_URL,
        (gltf: any) => {
          this.collision_scene = gltf.scene;

          if (!this.collision_scene) return resolve();

          this.collision_scene.updateMatrixWorld(true);

          const objectsToRemove: any[] = [];

          this.collision_scene.traverse((item: any) => {
            // Collect all unnecessary objects to remove (AGGRESSIVE)
            if (this.shouldRemoveObject(item)) {
              objectsToRemove.push(item);
              return;
            }

            if (item.name === 'home001' || item.name === 'PointLight') {
              item.castShadow = false; // Disabled
            }

            if (item.name?.includes('PointLight') && isLight(item)) {
              item.intensity *= 2000;
            }

            if (item.name === 'home002') {
              item.castShadow = false; // Disabled
              item.receiveShadow = false; // Disabled
            }

            // Clean up floor material - replace with white and disable shadows
            if (
              item.name &&
              (item.name.toLowerCase().includes('floor') ||
                item.name.toLowerCase().includes('ground')) &&
              isMesh(item)
            ) {
              item.castShadow = false;
              item.receiveShadow = false;
              // Replace floor material with clean white
              item.material = new MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.8,
                metalness: 0.1,
              });
            }

            // Extract frame elements - only first 6 boards
            if (
              item.name &&
              /gallery[1-6]_board/.test(item.name) &&
              isMesh(item)
            ) {
              this.gallery_boards[item.name] = item;
            }

            // Remove extra boards (7-10)
            if (item.name && /gallery([7-9]|10)_board/.test(item.name)) {
              objectsToRemove.push(item);
              return;
            }

            this.raycast_objects.push(item);
          });

          // Remove collected objects and dispose properly
          console.log(
            `Removing ${objectsToRemove.length} objects from collision scene`
          );
          objectsToRemove.forEach((obj) => {
            // Dispose materials and geometries to prevent memory leaks
            if (isMesh(obj)) {
              if (obj.geometry) obj.geometry.dispose();
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach((mat) => mat.dispose());
                } else {
                  obj.material.dispose();
                }
              }
            }
            obj.removeFromParent();
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
