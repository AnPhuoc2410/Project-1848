import Core from '../core';
import Loader from '../loader';
import {
  BOARD_TEXTURES,
  BOARDS_INFO,
  COLLISION_SCENE_URL,
  KARL_MARX_MODEL_URL,
  FRIEDRICH_ENGELS_MODEL_URL,
  LENIN_MODEL_URL,
  CONGNHAN_MODEL_URL,
  CONGNHAN2_MODEL_URL,
  CITY_MODEL_URL,
  BIEU_TUONG_PHAP_LUAT_MODEL_URL,
  DAN_TOC_TON_GIAO_MODEL_URL,
  FAMILY_MODEL_URL,
  MODEL_CONFIGS,
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
  SpotLight,
  PointLight,
  AmbientLight,
  DirectionalLight,
  Color,
  Vector3,
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
  private loaded_models: Record<string, Group> = {};
  raycast_objects: Object3D[] = [];
  is_load_finished = false;

  constructor() {
    console.log('🏛️ Environment constructor called');
    this.core = new Core();
    this.loader = this.core.loader;
    this._loadScenes();
  }

  /*
   * Load all scene objects - Bố cục Gallery 7 Chương CNXHKH
   */
  private async _loadScenes() {
    console.log('🏛️ _loadScenes() starting...');
    try {
      await this._loadSceneAndCollisionDetection();

      // Load tất cả models theo thứ tự chương
      await this._loadAllChapterModels();

      await this._loadBoardsTexture();
      this._configureGallery();
      this._setupGalleryLighting();
      this._createSpecularReflection();

      this.is_load_finished = true;
      this.core.$emit(ON_LOAD_MODEL_FINISH);
    } catch (e) {
      console.log(e);
    }
  }

  /*
   * Load tất cả models theo 7 chương + tổng quan
   */
  private async _loadAllChapterModels() {
    // ==========================================
    // TRUNG TÂM - Karl Marx (Tổng quan)
    // ==========================================
    await this._loadModel(
      'karlMarx',
      KARL_MARX_MODEL_URL,
      MODEL_CONFIGS.karlMarx,
      {
        name: 'Karl Marx',
        title: 'Karl Marx (1818-1883)',
        author: 'Nhà sáng lập Chủ nghĩa Mác',
        describe: `
          <strong>🔴 KARL MARX</strong><br><br>
          <strong>Karl Marx</strong> là nhà triết học, nhà kinh tế học và nhà cách mạng người Đức.
          Ông cùng với Friedrich Engels đã sáng lập ra <strong>Chủ nghĩa xã hội khoa học</strong>.<br><br>
          <strong>📌 Tác phẩm tiêu biểu:</strong><br>
          • Tư bản (Das Kapital)<br>
          • Tuyên ngôn Đảng Cộng sản<br>
          • Hệ tư tưởng Đức<br><br>
          <em>"Vô sản toàn thế giới, liên hiệp lại!"</em>
        `,
        show_boards: true,
        chapter: 'overview',
      }
    );

    // ==========================================
    // CHƯƠNG 1: Lý luận CNXH Khoa học
    // Engels & Lenin - Các nhà sáng lập
    // ==========================================
    await this._loadModel(
      'engels',
      FRIEDRICH_ENGELS_MODEL_URL,
      MODEL_CONFIGS.engels,
      {
        name: 'Friedrich Engels',
        title: 'Friedrich Engels (1820-1895)',
        author: 'Đồng sáng lập CNXH Khoa học',
        describe: `
          <strong>🔴 FRIEDRICH ENGELS</strong><br><br>
          <strong>Friedrich Engels</strong> là nhà triết học, nhà khoa học xã hội người Đức.
          Ông là người bạn, người đồng chí thân thiết nhất của Marx.<br><br>
          <strong>📌 Đóng góp:</strong><br>
          • Hoàn thành Tư bản (tập 2, 3)<br>
          • Chống Dühring<br>
          • Nguồn gốc của gia đình, chế độ tư hữu và nhà nước<br><br>
          <em>"Biện chứng của tự nhiên"</em>
        `,
        show_boards: true,
        chapter: 1,
      }
    );

    await this._loadModel('lenin', LENIN_MODEL_URL, MODEL_CONFIGS.lenin, {
      name: 'V.I. Lenin',
      title: 'Vladimir Ilyich Lenin (1870-1924)',
      author: 'Người phát triển CNXH Khoa học',
      describe: `
          <strong>🔴 V.I. LENIN</strong><br><br>
          <strong>Vladimir Ilyich Lenin</strong> là nhà cách mạng vĩ đại, lãnh tụ của giai cấp vô sản toàn thế giới.
          Ông đã phát triển chủ nghĩa Mác trong thời đại đế quốc chủ nghĩa.<br><br>
          <strong>📌 Công lao:</strong><br>
          • Lãnh đạo Cách mạng Tháng Mười Nga<br>
          • Xây dựng nhà nước Xô-viết đầu tiên<br>
          • Phát triển lý luận về Đảng kiểu mới<br><br>
          <em>"Học, học nữa, học mãi"</em>
        `,
      show_boards: true,
      chapter: 1,
    });

    // ==========================================
    // CHƯƠNG 2: Giai cấp Công nhân
    // Hai mô hình công nhân
    // ==========================================
    await this._loadModel(
      'congNhan1',
      CONGNHAN_MODEL_URL,
      MODEL_CONFIGS.congNhan1,
      {
        name: 'Công nhân 1',
        title: 'Giai cấp Công nhân',
        author: 'Lực lượng sản xuất tiên tiến',
        describe: `
          <strong>🔴 GIAI CẤP CÔNG NHÂN</strong><br><br>
          Giai cấp công nhân là giai cấp gắn liền với <strong>nền sản xuất công nghiệp hiện đại</strong>,
          đại diện cho lực lượng sản xuất tiên tiến nhất.<br><br>
          <strong>📌 Đặc điểm:</strong><br>
          • Lao động bằng tư liệu sản xuất của người khác<br>
          • Tính tổ chức, kỷ luật cao<br>
          • Tinh thần quốc tế vô sản<br><br>
          <em>"Vô sản không có gì để mất ngoài xiềng xích!"</em>
        `,
        show_boards: true,
        chapter: 2,
      }
    );

    await this._loadModel(
      'congNhan2',
      CONGNHAN2_MODEL_URL,
      MODEL_CONFIGS.congNhan2,
      {
        name: 'Công nhân 2',
        title: 'Sứ mệnh lịch sử Công nhân',
        author: 'Xóa bỏ áp bức, bóc lột',
        describe: `
          <strong>🔴 SỨ MỆNH LỊCH SỬ</strong><br><br>
          Giai cấp công nhân có sứ mệnh lịch sử <strong>lãnh đạo cách mạng xã hội chủ nghĩa</strong>,
          xóa bỏ chế độ tư bản, xây dựng xã hội mới.<br><br>
          <strong>📌 Nhiệm vụ:</strong><br>
          • Lật đổ giai cấp tư sản<br>
          • Xây dựng chế độ XHCN<br>
          • Giải phóng toàn nhân loại<br><br>
          <em>"Công nhân là người chủ tương lai!"</em>
        `,
        show_boards: true,
        chapter: 2,
      }
    );

    // ==========================================
    // CHƯƠNG 3: Thời kỳ Quá độ
    // Mô hình thành phố công nghiệp hóa
    // ==========================================
    await this._loadModel('city', CITY_MODEL_URL, MODEL_CONFIGS.city, {
      name: 'Thành phố công nghiệp',
      title: 'Công nghiệp hóa - Hiện đại hóa',
      author: 'Biểu tượng thời kỳ quá độ',
      describe: `
          <strong>🔴 THỜI KỲ QUÁ ĐỘ</strong><br><br>
          Thời kỳ quá độ lên CNXH là giai đoạn <strong>cải biến sâu sắc</strong> mọi lĩnh vực,
          từ TBCN sang XHCN hoặc bỏ qua TBCN.<br><br>
          <strong>📌 Đặc trưng:</strong><br>
          • Công nghiệp hóa, hiện đại hóa<br>
          • Xây dựng cơ sở vật chất kỹ thuật<br>
          • Phát triển kinh tế thị trường định hướng XHCN<br>
          • Tồn tại đan xen cũ - mới<br><br>
          <em>"Không thể nhảy cóc qua các giai đoạn!"</em>
        `,
      show_boards: true,
      chapter: 3,
    });

    // ==========================================
    // CHƯƠNG 4: Nhà nước & Dân chủ XHCN
    // Biểu tượng pháp luật
    // ==========================================
    await this._loadModel(
      'phapLuat',
      BIEU_TUONG_PHAP_LUAT_MODEL_URL,
      MODEL_CONFIGS.phapLuat,
      {
        name: 'Biểu tượng Pháp luật',
        title: 'Nhà nước pháp quyền XHCN',
        author: 'Của dân, do dân, vì dân',
        describe: `
          <strong>🔴 NHÀ NƯỚC PHÁP QUYỀN XHCN</strong><br><br>
          Nhà nước pháp quyền XHCN Việt Nam là nhà nước <strong>của nhân dân, do nhân dân, vì nhân dân</strong>,
          quản lý xã hội bằng pháp luật.<br><br>
          <strong>📌 Nguyên tắc:</strong><br>
          • Tất cả quyền lực thuộc về nhân dân<br>
          • Pháp luật là tối thượng<br>
          • Bảo vệ quyền con người<br>
          • Phân công, phối hợp quyền lực<br><br>
          <em>"Pháp luật bảo vệ quyền và lợi ích của nhân dân!"</em>
        `,
        show_boards: true,
        chapter: 4,
      }
    );

    // ==========================================
    // CHƯƠNG 6: Dân tộc & Tôn giáo
    // Biểu tượng đoàn kết dân tộc
    // ==========================================
    await this._loadModel(
      'danTocTonGiao',
      DAN_TOC_TON_GIAO_MODEL_URL,
      MODEL_CONFIGS.danTocTonGiao,
      {
        name: 'Dân tộc Tôn giáo',
        title: 'Đoàn kết Dân tộc - Tôn giáo',
        author: '54 dân tộc anh em',
        describe: `
          <strong>🔴 DÂN TỘC VÀ TÔN GIÁO</strong><br><br>
          Việt Nam có <strong>54 dân tộc anh em</strong>, đoàn kết trong khối đại đoàn kết toàn dân tộc,
          tôn trọng tự do tín ngưỡng, tôn giáo.<br><br>
          <strong>📌 Chính sách:</strong><br>
          • Bình đẳng, đoàn kết, tương trợ<br>
          • Tự do tín ngưỡng, tôn giáo<br>
          • Giữ gìn bản sắc văn hóa<br>
          • Phát triển kinh tế vùng đồng bào<br><br>
          <em>"Đoàn kết, đoàn kết, đại đoàn kết!"</em>
        `,
        show_boards: true,
        chapter: 6,
      }
    );

    // ==========================================
    // CHƯƠNG 7: Gia đình trong CNXH
    // Mô hình gia đình
    // ==========================================
    await this._loadModel('family', FAMILY_MODEL_URL, MODEL_CONFIGS.family, {
      name: 'Gia đình',
      title: 'Gia đình - Tế bào xã hội',
      author: 'Hạnh phúc, bình đẳng, tiến bộ',
      describe: `
          <strong>🔴 GIA ĐÌNH TRONG CNXH</strong><br><br>
          Gia đình là <strong>tế bào của xã hội</strong>, là nơi nuôi dưỡng, giáo dục
          con người mới xã hội chủ nghĩa.<br><br>
          <strong>📌 Đặc trưng:</strong><br>
          • Bình đẳng giới<br>
          • Hạnh phúc, tiến bộ<br>
          • Nuôi dạy thế hệ tương lai<br>
          • Ấm no, hòa thuận<br><br>
          <em>"Gia đình là nền tảng của xã hội!"</em>
        `,
      show_boards: true,
      chapter: 7,
    });
  }

  /*
   * Helper function để load model với config
   */
  private _loadModel(
    modelKey: string,
    modelUrl: string,
    config: {
      position: { x: number; y: number; z: number };
      scale: number;
      rotation: { x: number; y: number; z: number };
    },
    userData: Record<string, any>
  ): Promise<void> {
    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        modelUrl,
        (gltf: any) => {
          const model = gltf.scene as Group;

          // Apply position, scale, rotation từ config
          model.position.set(
            config.position.x,
            config.position.y,
            config.position.z
          );
          model.scale.setScalar(config.scale);
          model.rotation.set(
            config.rotation.x,
            config.rotation.y,
            config.rotation.z
          );

          // Setup model properties
          model.traverse((item: any) => {
            if (isMesh(item)) {
              item.castShadow = false;
              item.receiveShadow = false;
              // Simplify geometry để giảm lag
              if (item.geometry) {
                item.geometry.computeBoundingSphere();
              }
              // Assign userData cho từng mesh để tooltip hiện đúng
              item.userData = { ...userData };
            }
          });

          // Assign userData cho model group
          model.userData = { ...userData };

          // CHỈ PUSH MODEL GROUP vào raycast - giảm objects nhưng vẫn raycast children
          this.raycast_objects.push(model);

          // Store reference và add to scene
          this.loaded_models[modelKey] = model;
          this.core.scene.add(model);

          console.log(`✅ Loaded: ${modelKey} at`, config.position);
          resolve();
        },
        (event: any) => {
          this.core.$emit(ON_LOAD_PROGRESS, {
            url: modelUrl,
            loaded: event.loaded,
            total: event.total,
          });
        },
        (error: any) => {
          console.warn(`⚠️ Failed to load ${modelKey}:`, error);
          resolve(); // Continue even if one model fails
        }
      );
    });
  }

  /*
   * Setup Gallery Lighting - Ánh sáng chuyên nghiệp cho gallery
   */
  private _setupGalleryLighting() {
    // Ambient light - tăng intensity để giảm số light khác
    const ambientLight = new AmbientLight(0xffffff, 0.6);
    this.core.scene.add(ambientLight);

    // Directional light - ánh sáng chính mạnh hơn
    const mainLight = new DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(0, 20, 10);
    this.core.scene.add(mainLight);

    // CHỈ 2 spotlight cho Karl Marx (trung tâm) - giảm lag
    const spotlightConfigs = [
      {
        position: new Vector3(0, 15, 28),
        target: new Vector3(0, 0, 28),
        intensity: 1.0,
      }, // Karl Marx spotlight 1
      {
        position: new Vector3(5, 12, 25),
        target: new Vector3(0, 0, 28),
        intensity: 0.8,
      }, // Karl Marx spotlight 2 - góc khác
    ];

    spotlightConfigs.forEach((config) => {
      const spotlight = new SpotLight(0xfff5e6, config.intensity);
      spotlight.position.copy(config.position);
      spotlight.target.position.copy(config.target);
      spotlight.angle = Math.PI / 5;
      spotlight.penumbra = 0.4;
      spotlight.decay = 2;
      spotlight.distance = 35;
      spotlight.castShadow = false;
      this.core.scene.add(spotlight);
      this.core.scene.add(spotlight.target);
    });

    // BỎ point lights - quá nhiều light gây lag
    // Thay bằng 1 directional light bổ sung
    const fillLight = new DirectionalLight(0xffd4a3, 0.3);
    fillLight.position.set(-10, 5, -10);
    this.core.scene.add(fillLight);
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
    // Optional: Bật sàn phản chiếu cho hiệu ứng đẹp
    // Uncomment nếu muốn có hiệu ứng gương sàn
    /*
    const mirror = new Reflector(new PlaneGeometry(100, 100), {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x222222,
    });
    if (mirror.material instanceof Material) {
      mirror.material.transparent = true;
      (mirror.material as any).opacity = 0.15;
    }
    mirror.rotation.x = -0.5 * Math.PI;
    mirror.position.y = -0.01;
    this.core.scene.add(mirror);
    */
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
        },
        (error: any) => {
          console.warn('⚠️ Static scene not found, skipping:', error);
          resolve(); // Continue without static scene
        }
      );
    });
  }

  /*
   * Create a fallback floor when scene models are not available
   */
  private _createFallbackFloor() {
    console.log('🏗️ Creating fallback floor (collision only, invisible)...');

    // Create collision geometry only - NO visible floor to avoid overlapping with existing scene
    const collisionGeometry = new PlaneGeometry(200, 200);
    collisionGeometry.rotateX(-Math.PI / 2);
    (collisionGeometry as any).boundsTree = new MeshBVH(collisionGeometry, {
      lazyGeneration: false,
    } as MeshBVHOptions);

    this.collider = new Mesh(collisionGeometry);
    this.collider.position.y = 0;
    this.collider.visible = false; // Invisible - collision only
    this.collider.updateMatrixWorld(true);

    console.log('✅ Fallback floor created');
  }

  private _loadSceneAndCollisionDetection(): Promise<void> {
    console.log(
      '🚀 Starting to load collision scene from:',
      COLLISION_SCENE_URL
    );

    return new Promise((resolve) => {
      this.loader.gltf_loader.load(
        COLLISION_SCENE_URL,
        (gltf: any) => {
          console.log('✅ Collision scene loaded successfully!');
          this.collision_scene = gltf.scene;

          if (!this.collision_scene) {
            console.warn('⚠️ Collision scene is empty!');
            return resolve();
          }

          console.log(
            '📊 Scene children count:',
            this.collision_scene.children.length
          );
          this.collision_scene.updateMatrixWorld(true);

          const itemsToRemove: any[] = [];

          this.collision_scene.traverse((item: any) => {
            // FIX: Keep texture but brighten floor and remove shadow effects
            if (isMesh(item)) {
              if (
                item.name === 'home' ||
                item.name === 'home001' ||
                item.name === 'home002'
              ) {
                const material = item.material as any;
                if (material) {
                  // Keep the texture but brighten the material color
                  if (material.color) {
                    // Boost the color to counteract dark baked shadows
                    material.color.setRGB(1.3, 1.3, 1.3); // Brighten
                    material.needsUpdate = true;
                  }

                  // Remove shadow-causing maps
                  if (material.aoMap) {
                    material.aoMap = null;
                    material.aoMapIntensity = 0;
                  }
                  if (material.lightMap) {
                    material.lightMap = null;
                    material.lightMapIntensity = 0;
                  }

                  // Increase material brightness/emissive slightly
                  if (material.emissive) {
                    material.emissive.setHex(0x222222);
                    material.emissiveIntensity = 0.3;
                  }

                  material.needsUpdate = true;
                  console.log('💡 Brightened floor:', item.name);
                }
              }
            }

            // Enhanced logging - log ALL mesh details for debugging
            if (isMesh(item)) {
              const material = item.material as any;
              const worldPos = new Vector3();
              item.getWorldPosition(worldPos);

              let brightness = 1;
              if (material?.color) {
                brightness =
                  (material.color.r + material.color.g + material.color.b) / 3;
              }

              console.log(
                '🔍 MESH:',
                item.name,
                '| Type:',
                item.type,
                '| Pos:',
                worldPos.x.toFixed(1),
                worldPos.y.toFixed(1),
                worldPos.z.toFixed(1),
                '| Brightness:',
                brightness.toFixed(2),
                '| Transparent:',
                material?.transparent,
                '| Opacity:',
                material?.opacity?.toFixed(2)
              );
            }

            // Hide dark patches, shadows, decals, and unwanted floor elements
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
              // Patterns for dark patches and unwanted elements
              'shadow',
              'decal',
              'stain',
              'dirt',
              'dark',
              'spot',
              'mark',
              'floor_detail',
              'ground_detail',
              'puddle',
              'wet',
              'damage',
              'crack',
              // Additional patterns for baked effects
              'ao',
              'ambient',
              'occlusion',
              'bake',
              'overlay',
              'blend',
              'detail',
              'splat',
              'grunge',
              'worn',
              'scratch',
              'scuff',
              'smudge',
              'reflection',
              // More shadow-related patterns
              'blob',
              'patch',
              'floor_shadow',
              'ground_shadow',
              'baked_shadow',
              'lightmap',
              'shadowmap',
              'footprint',
              'burn',
              'soot',
              'ash',
              'spill',
              'leak',
              'drip',
              'moss',
              'mold',
              'rust',
              'decay',
              'erosion',
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

            // Remove meshes with very dark materials (likely baked shadows)
            if (isMesh(item)) {
              const material = item.material as any;
              if (material) {
                // Compute bounding box if not exists
                if (item.geometry && !item.geometry.boundingBox) {
                  item.geometry.computeBoundingBox();
                }

                // Get world position for spawn area detection
                const worldPos = new Vector3();
                item.getWorldPosition(worldPos);

                // Check if material color is very dark (baked shadow)
                if (material.color) {
                  const r = material.color.r;
                  const g = material.color.g;
                  const b = material.color.b;
                  const brightness = (r + g + b) / 3;

                  // AGGRESSIVE: Remove ANY dark mesh that's flat (likely shadow decal)
                  if (
                    brightness < 0.4 &&
                    item.geometry &&
                    item.geometry.boundingBox
                  ) {
                    const bbox = item.geometry.boundingBox;
                    const size = bbox.max.clone().sub(bbox.min);

                    // Flat dark mesh = shadow decal
                    if (size.y < 2.0) {
                      item.visible = false;
                      itemsToRemove.push(item);
                      console.log(
                        '🗑️ Removed dark flat mesh:',
                        item.name,
                        'brightness:',
                        brightness.toFixed(2),
                        'pos:',
                        worldPos.z.toFixed(1)
                      );
                      return;
                    }
                  }

                  // Also check for semi-transparent dark materials (shadow blobs)
                  if (brightness < 0.5 && material.transparent) {
                    item.visible = false;
                    itemsToRemove.push(item);
                    console.log(
                      '🗑️ Removed transparent dark patch:',
                      item.name
                    );
                    return;
                  }

                  // Near spawn area (z: 25-45) - be extra aggressive
                  if (
                    worldPos.z > 25 &&
                    worldPos.z < 55 &&
                    brightness < 0.5 &&
                    worldPos.y < 3
                  ) {
                    if (item.geometry && item.geometry.boundingBox) {
                      const size = item.geometry.boundingBox.max
                        .clone()
                        .sub(item.geometry.boundingBox.min);
                      if (size.y < 3) {
                        item.visible = false;
                        itemsToRemove.push(item);
                        console.log(
                          '🗑️ Removed spawn area dark mesh:',
                          item.name,
                          'at z:',
                          worldPos.z.toFixed(1)
                        );
                        return;
                      }
                    }
                  }
                }

                // Check for dark alpha maps or opacity maps causing patches
                if (
                  material.alphaMap ||
                  (material.opacity !== undefined && material.opacity < 0.95)
                ) {
                  const matColor = material.color;
                  if (matColor) {
                    const brightness =
                      (matColor.r + matColor.g + matColor.b) / 3;
                    if (brightness < 0.6) {
                      item.visible = false;
                      itemsToRemove.push(item);
                      console.log(
                        '🗑️ Removed alpha dark patch:',
                        item.name,
                        'opacity:',
                        material.opacity
                      );
                      return;
                    }
                  }
                }

                // Remove any aoMap (ambient occlusion) which can cause dark patches
                if (material.aoMap) {
                  console.log('🔧 Removing aoMap from:', item.name);
                  material.aoMap = null;
                  material.aoMapIntensity = 0;
                  material.needsUpdate = true;
                }

                // Remove lightMap if it's causing dark areas
                if (material.lightMap) {
                  console.log('🔧 Removing lightMap from:', item.name);
                  material.lightMap = null;
                  material.lightMapIntensity = 0;
                  material.needsUpdate = true;
                }

                // Disable any emissive that might be creating odd effects
                if (material.emissiveMap) {
                  material.emissiveMap = null;
                  material.needsUpdate = true;
                }

                // BRIGHTEN dark floor materials instead of removing
                if (material.color && worldPos.y < 1) {
                  const brightness =
                    (material.color.r + material.color.g + material.color.b) /
                    3;
                  if (brightness < 0.3 && brightness > 0) {
                    // Brighten the material
                    const boostFactor = 0.4 / brightness;
                    material.color.r = Math.min(
                      1,
                      material.color.r * boostFactor
                    );
                    material.color.g = Math.min(
                      1,
                      material.color.g * boostFactor
                    );
                    material.color.b = Math.min(
                      1,
                      material.color.b * boostFactor
                    );
                    material.needsUpdate = true;
                    console.log('💡 Brightened floor material:', item.name);
                  }
                }
              }
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
        },
        (error: any) => {
          console.warn(
            '⚠️ Collision scene not found, creating fallback floor:',
            error
          );
          this._createFallbackFloor();
          resolve(); // Continue with fallback
        }
      );
    });
  }
}
