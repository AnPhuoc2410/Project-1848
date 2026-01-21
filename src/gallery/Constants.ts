/*
 * Model Resources - Scene Base
 * */
export const COLLISION_SCENE_URL = new URL(
  './assets/models/scene_collision.glb',
  import.meta.url
).href;
export const STATIC_SCENE_URL = new URL(
  './assets/models/scene_desk_obj.glb',
  import.meta.url
).href;

/*
 * Model Resources - Nhân vật & Biểu tượng theo Chương
 * */

// Chương 1: Lý luận CNXH Khoa học - Các nhà sáng lập
export const KARL_MARX_MODEL_URL = new URL(
  './assets/models/karl_marx_statue.glb',
  import.meta.url
).href;
export const FRIEDRICH_ENGELS_MODEL_URL = new URL(
  './assets/models/Friedrich_Engels_chuong1 .glb',
  import.meta.url
).href;
export const LENIN_MODEL_URL = new URL(
  './assets/models/lenin_chuong1.glb',
  import.meta.url
).href;

// Chương 2: Giai cấp Công nhân
export const CONGNHAN_MODEL_URL = new URL(
  './assets/models/congnhan_chuong2.glb',
  import.meta.url
).href;
export const CONGNHAN2_MODEL_URL = new URL(
  './assets/models/congnhan2_chuong2.glb',
  import.meta.url
).href;

// Chương 3: Thời kỳ Quá độ - Thành phố công nghiệp hóa
export const CITY_MODEL_URL = new URL(
  './assets/models/city_3d_model.glb',
  import.meta.url
).href;

// Chương 4: Nhà nước & Dân chủ XHCN
export const BIEU_TUONG_PHAP_LUAT_MODEL_URL = new URL(
  './assets/models/bieutuongphapluat.glb',
  import.meta.url
).href;

// Chương 6: Dân tộc & Tôn giáo
export const DAN_TOC_TON_GIAO_MODEL_URL = new URL(
  './assets/models/dantoctongiao.glb',
  import.meta.url
).href;

// Chương 7: Gia đình trong CNXH
export const FAMILY_MODEL_URL = new URL(
  './assets/models/family.glb',
  import.meta.url
).href;

/*
 * Model Positions & Scale Config - Bố cục Gallery
 * Thư viện được chia thành các khu vực theo chủ đề
 * */
export const MODEL_CONFIGS = {
  // ==========================================
  // KHU VỰC TRUNG TÂM - TỔNG QUAN
  // Karl Marx đặt ở vị trí trung tâm, đón khách
  // ==========================================
  karlMarx: {
    position: { x: 0, y: 1, z: 28 },
    scale: 0.3,
    rotation: { x: 0, y: Math.PI, z: 0 },
    chapter: 'overview',
    description: 'Karl Marx - Trung tâm thư viện',
  },

  // ==========================================
  // CÁNH TRÁI - CHƯƠNG 1, 2, 3
  // ==========================================

  // Engels & Lenin - Chương 1: Bên cạnh bảng Chương 1
  engels: {
    position: { x: -18, y: 1, z: 15 },
    scale: 1.5,
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    chapter: 1,
    description: 'Friedrich Engels - Đồng sáng lập CNXHKH',
  },
  lenin: {
    position: { x: -22, y: 1, z: 10 },
    scale: 1.5,
    rotation: { x: 0, y: Math.PI / 3, z: 0 },
    chapter: 1,
    description: 'V.I. Lenin - Phát triển CNXHKH',
  },

  // Công nhân - Chương 2: Khu vực giai cấp công nhân
  congNhan1: {
    position: { x: -15, y: 1, z: -5 },
    scale: 1.2,
    rotation: { x: 0, y: Math.PI / 6, z: 0 },
    chapter: 2,
    description: 'Công nhân - Lực lượng sản xuất tiên tiến',
  },
  congNhan2: {
    position: { x: -18, y: 1, z: -8 },
    scale: 1.2,
    rotation: { x: 0, y: -Math.PI / 8, z: 0 },
    chapter: 2,
    description: 'Công nhân - Sứ mệnh lịch sử',
  },

  // Thành phố - Chương 3: Quá độ, công nghiệp hóa
  city: {
    position: { x: -20, y: 0.5, z: -20 },
    scale: 0.8,
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    chapter: 3,
    description: 'Thành phố công nghiệp hóa - Biểu tượng quá độ',
  },

  // ==========================================
  // CÁNH PHẢI - CHƯƠNG 4, 5, 6, 7
  // ==========================================

  // Biểu tượng pháp luật - Chương 4: Nhà nước pháp quyền
  phapLuat: {
    position: { x: 18, y: 1, z: 15 },
    scale: 1.5,
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    chapter: 4,
    description: 'Biểu tượng công lý - Nhà nước pháp quyền XHCN',
  },

  // Dân tộc tôn giáo - Chương 6
  danTocTonGiao: {
    position: { x: 20, y: 1, z: -5 },
    scale: 1.3,
    rotation: { x: 0, y: -Math.PI / 6, z: 0 },
    chapter: 6,
    description: '54 dân tộc anh em - Đoàn kết tôn giáo',
  },

  // Gia đình - Chương 7: Tế bào xã hội
  family: {
    position: { x: 15, y: 1, z: -18 },
    scale: 1.3,
    rotation: { x: 0, y: -Math.PI / 3, z: 0 },
    chapter: 7,
    description: 'Gia đình hạnh phúc - Tế bào xã hội XHCN',
  },
};

/*
 * Texture Resources - 7 Chương CNXH Khoa học
 * */
export const BOARD_TEXTURES = [
  new URL('./assets/boards/chuong1.png', import.meta.url).href,
  new URL('./assets/boards/chuong2.png', import.meta.url).href,
  new URL('./assets/boards/chuong3.png', import.meta.url).href,
  new URL('./assets/boards/chuong4.png', import.meta.url).href,
  new URL('./assets/boards/chuong5.png', import.meta.url).href,
  new URL('./assets/boards/chuong6.png', import.meta.url).href,
  new URL('./assets/boards/chuong7.png', import.meta.url).href,
  new URL('./assets/boards/overviewCNXH.png', import.meta.url).href,
  new URL('./assets/boards/cmt10Nga.png', import.meta.url).href,
  new URL('./assets/boards/vietnamcnxh.png', import.meta.url).href,
];

/*
 * Audio Resources
 * */
export const AUDIO_URL = new URL('./assets/audio/music.m4a', import.meta.url)
  .href;

/*
 * Board Info - 7 Chương CNXH Khoa học
 * */
export const BOARDS_INFO = {
  1: {
    title: 'Chương 1: Lý luận CNXH Khoa học',
    author: 'C. Mác – Ph. Ăngghen – V.I. Lênin',
    describe: `
		<strong>🔴 CHỦ NGHĨA XÃ HỘI KHOA HỌC</strong><br><br>
		Chủ nghĩa xã hội khoa học ra đời trên cơ sở kế thừa tinh hoa tư tưởng nhân loại và tổng kết thực tiễn phong trào công nhân, do <strong>C. Mác và Ph. Ăngghen</strong> sáng lập, được <strong>V.I. Lênin</strong> phát triển.<br><br>
		Đây là nền tảng tư tưởng và phương pháp luận khoa học cho việc xây dựng xã hội mới.<br><br>
		<strong>📌 Ý chính:</strong><br>
		• CNXH khoa học khác CNXH không tưởng<br>
		• Có cơ sở khoa học và thực tiễn<br>
		• Là nền tảng cho toàn bộ các chương sau
		`,
  },
  2: {
    title: 'Chương 2: Giai cấp Công nhân',
    author: 'Sứ mệnh lịch sử của giai cấp công nhân',
    describe: `
		<strong>🔴 GIAI CẤP CÔNG NHÂN</strong><br><br>
		Giai cấp công nhân là <strong>lực lượng sản xuất tiên tiến</strong>, có sứ mệnh lịch sử lãnh đạo cách mạng xã hội chủ nghĩa, xóa bỏ áp bức bóc lột, xây dựng xã hội mới công bằng, tiến bộ.<br><br>
		<strong>📌 Ý chính:</strong><br>
		• Lực lượng lãnh đạo cách mạng<br>
		• Gắn với sản xuất hiện đại<br>
		• Vai trò trung tâm trong xây dựng CNXH ở Việt Nam<br><br>
		<em>"Vô sản toàn thế giới, đoàn kết lại!"</em>
		`,
  },
  3: {
    title: 'Chương 3: Thời kỳ Quá độ',
    author: 'Quá độ lên Chủ nghĩa Xã hội',
    describe: `
		<strong>🔴 THỜI KỲ QUÁ ĐỘ</strong><br><br>
		Thời kỳ quá độ lên chủ nghĩa xã hội là giai đoạn <strong>cải biến sâu sắc</strong> mọi lĩnh vực của đời sống xã hội, tồn tại đan xen các yếu tố cũ và mới.<br><br>
		<strong>⚠️ Không thể rút ngắn bằng ý chí chủ quan.</strong><br><br>
		<strong>📌 Ý chính:</strong><br>
		• Quá trình lâu dài, phức tạp<br>
		• Không thể "nhảy cóc"<br>
		• Phù hợp điều kiện Việt Nam<br>
		• Công nghiệp hóa, hiện đại hóa đất nước
		`,
  },
  4: {
    title: 'Chương 4: Nhà nước & Dân chủ XHCN',
    author: 'Nhà nước pháp quyền XHCN Việt Nam',
    describe: `
		<strong>🔴 NHÀ NƯỚC PHÁP QUYỀN XHCN</strong><br><br>
		Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam là nhà nước <strong>của nhân dân, do nhân dân và vì nhân dân</strong>, bảo đảm quyền làm chủ của nhân dân, quản lý xã hội bằng pháp luật.<br><br>
		<strong>📌 Ý chính:</strong><br>
		• Lập pháp – Hành pháp – Tư pháp<br>
		• Phát huy dân chủ<br>
		• Phòng, chống tham nhũng<br>
		• Bảo vệ quyền con người
		`,
  },
  5: {
    title: 'Chương 5: Liên minh Giai cấp',
    author: 'Công nhân – Nông dân – Trí thức',
    describe: `
		<strong>🔴 LIÊN MINH GIAI CẤP</strong><br><br>
		Liên minh giai cấp <strong>công nhân – nông dân – trí thức</strong> là nền tảng chính trị – xã hội vững chắc của chế độ xã hội chủ nghĩa trong thời kỳ quá độ ở Việt Nam.<br><br>
		<strong>📌 Ý chính:</strong><br>
		• Đảm bảo ổn định xã hội<br>
		• Phát triển hài hòa các giai cấp<br>
		• Điều kiện giữ vững CNXH<br>
		• Đại đoàn kết toàn dân tộc
		`,
  },
  6: {
    title: 'Chương 6: Dân tộc & Tôn giáo',
    author: 'Đoàn kết dân tộc – Tự do tín ngưỡng',
    describe: `
		<strong>🔴 DÂN TỘC VÀ TÔN GIÁO</strong><br><br>
		Đoàn kết các dân tộc và tôn trọng tự do tín ngưỡng là <strong>nguyên tắc nhất quán</strong> của Đảng và Nhà nước Việt Nam, nhằm xây dựng khối đại đoàn kết toàn dân tộc.<br><br>
		<strong>📌 Ý chính:</strong><br>
		• 54 dân tộc Việt Nam anh em<br>
		• Tự do tín ngưỡng, tôn giáo<br>
		• Không phân biệt đối xử<br>
		• Đa dạng văn hóa, thống nhất quốc gia
		`,
  },
  7: {
    title: 'Chương 7: Gia đình trong CNXH',
    author: 'Gia đình – Tế bào của xã hội',
    describe: `
		<strong>🔴 GIA ĐÌNH TRONG CNXH</strong><br><br>
		Gia đình là <strong>tế bào của xã hội</strong>, nơi hình thành và nuôi dưỡng con người mới xã hội chủ nghĩa, góp phần xây dựng xã hội ổn định và phát triển bền vững.<br><br>
		<strong>📌 Ý chính:</strong><br>
		• Bình đẳng giới<br>
		• Hạnh phúc – Tiến bộ<br>
		• Gia đình Việt Nam hiện đại<br>
		• Nuôi dưỡng thế hệ tương lai
		`,
  },
  8: {
    title: 'Tổng quan CNXH Khoa học',
    author: 'Hệ thống lý luận Mác-Lênin',
    describe: `
		<strong>🔴 TỔNG QUAN</strong><br><br>
		Chủ nghĩa xã hội khoa học là một trong <strong>ba bộ phận cấu thành</strong> của chủ nghĩa Mác-Lênin, cùng với Triết học Mác-Lênin và Kinh tế chính trị Mác-Lênin.<br><br>
		<strong>📌 Ba bộ phận:</strong><br>
		• Triết học Mác-Lênin<br>
		• Kinh tế chính trị Mác-Lênin<br>
		• Chủ nghĩa xã hội khoa học<br><br>
		<em>Đây là kim chỉ nam cho cách mạng vô sản thế giới.</em>
		`,
  },
  9: {
    title: 'Cách mạng Tháng Mười Nga',
    author: 'V.I. Lênin – 1917',
    describe: `
		<strong>🔴 CÁCH MẠNG THÁNG MƯỜI</strong><br><br>
		Cách mạng Tháng Mười Nga năm 1917 do <strong>V.I. Lênin</strong> lãnh đạo là cuộc cách mạng vô sản đầu tiên thành công trên thế giới, mở ra kỷ nguyên mới cho nhân loại.<br><br>
		<strong>📌 Ý nghĩa lịch sử:</strong><br>
		• Lật đổ chế độ Nga hoàng<br>
		• Xây dựng nhà nước Xô-viết<br>
		• Thức tỉnh các dân tộc bị áp bức<br>
		• Ảnh hưởng đến Việt Nam
		`,
  },
  10: {
    title: 'Việt Nam trên con đường CNXH',
    author: 'Đảng Cộng sản Việt Nam',
    describe: `
		<strong>🔴 VIỆT NAM VÀ CNXH</strong><br><br>
		Việt Nam kiên định con đường <strong>độc lập dân tộc gắn liền với chủ nghĩa xã hội</strong>, xây dựng đất nước ngày càng giàu mạnh, dân chủ, công bằng, văn minh.<br><br>
		<strong>📌 Mục tiêu:</strong><br>
		• Dân giàu, nước mạnh<br>
		• Dân chủ, công bằng, văn minh<br>
		• Hội nhập quốc tế<br>
		• Bảo vệ Tổ quốc XHCN
		`,
  },
};

/*
 * Computer Iframe SRC
 * */
export const IFRAME_SRC = new URL('/universe/index.html', import.meta.url).href;

/*
 * Events
 * */
export const ON_LOAD_PROGRESS = 'on-load-progress';
export const ON_LOAD_MODEL_FINISH = 'on-load-model-finish';
export const ON_CLICK_RAY_CAST = 'on-click-ray-cast';
export const ON_SHOW_TOOLTIP = 'on-show-tooltip';
export const ON_HIDE_TOOLTIP = 'on-hide-tooltip';
export const ON_KEY_DOWN = 'on-key-down';
export const ON_KEY_UP = 'on-key-up';
export const ON_ENTER_APP = 'on-enter-app';
