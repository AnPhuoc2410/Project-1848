const courseModules = [
  {
    id: 1,
    title: 'Nhập môn Chủ nghĩa xã hội khoa học',
    description:
      'Đối tượng, phương pháp và ý nghĩa của việc học tập, nghiên cứu chủ nghĩa xã hội khoa học.',
    content: `
      <h3>1. Đối tượng nghiên cứu</h3>
      <p>Chủ nghĩa xã hội khoa học nghiên cứu những quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển của hình thái kinh tế - xã hội cộng sản chủ nghĩa.</p>
      
      <h3>2. Phương pháp nghiên cứu</h3>
      <p>Sử dụng phương pháp luận của chủ nghĩa duy vật biện chứng và chủ nghĩa duy vật lịch sử, kết hợp với các phương pháp logic và lịch sử, khảo sát và phân tích thực tiễn...</p>

      <h3>3. Ý nghĩa học tập</h3>
      <p>Giúp trang bị thế giới quan khoa học, niềm tin vào sự thắng lợi của chủ nghĩa xã hội và chủ nghĩa cộng sản.</p>
    `,
  },
  {
    id: 2,
    title: 'Sứ mệnh lịch sử của giai cấp công nhân',
    description:
      'Nội dung và những điều kiện khách quan quy định sứ mệnh lịch sử của giai cấp công nhân.',
    content: `
      <h3>1. Khái niệm giai cấp công nhân</h3>
      <p>Là một tập đoàn xã hội ổn định, hình thành và phát triển cùng với quá trình phát triển của nền công nghiệp hiện đại.</p>

      <h3>2. Nội dung sứ mệnh lịch sử</h3>
      <p>Xóa bỏ chế độ tư bản chủ nghĩa, xóa bỏ chế độ người bóc lột người, giải phóng giai cấp công nhân, nhân dân lao động và toàn thể nhân loại khỏi mọi sự áp bức, bóc lột.</p>

      <h3>3. Điều kiện khách quan</h3>
      <p>Do địa vị kinh tế - xã hội và đặc điểm chính trị - xã hội của giai cấp công nhân quy định.</p>
    `,
  },
  {
    id: 3,
    title: 'Chủ nghĩa xã hội và thời kỳ quá độ',
    description:
      'Những đặc trưng cơ bản của chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội.',
    content: `
      <h3>1. Thời kỳ quá độ lên chủ nghĩa xã hội</h3>
      <p>Là thời kỳ cải biến cách mạng sâu sắc toàn bộ xã hội trên tất cả các lĩnh vực, từ kinh tế, chính trị, văn hóa đến xã hội.</p>

      <h3>2. Đặc trưng cơ bản của CNXH</h3>
      <p>- Giải phóng giai cấp, giải phóng xã hội, giải phóng con người.<br/>
      - Có nền kinh tế phát triển cao dựa trên lực lượng sản xuất hiện đại và chế độ công hữu về tư liệu sản xuất chủ yếu.<br/>
      - Có nhà nước kiểu mới mang bản chất giai cấp công nhân.</p>
    `,
  },
  {
    id: 4,
    title: 'Vấn đề dân tộc và tôn giáo',
    description:
      'Chủ nghĩa Mác - Lênin về vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội.',
    content: `
      <h3>1. Vấn đề dân tộc</h3>
      <p>Các dân tộc hoàn toàn bình đẳng, có quyền tự quyết và liên hiệp công nhân tất cả các dân tộc.</p>

      <h3>2. Vấn đề tôn giáo</h3>
      <p>Tôn trọng quyền tự do tín ngưỡng và không tín ngưỡng của nhân dân. Khắc phục dần những ảnh hưởng tiêu cực của tôn giáo gắn liền với quá trình cải tạo xã hội cũ, xây dựng xã hội mới.</p>
    `,
  },
  {
    id: 5,
    title: 'Vấn đề gia đình',
    description:
      'Xây dựng gia đình kiểu mới xã hội chủ nghĩa và các giá trị gia đình trong xã hội hiện đại.',
    content: `
        <h3>1. Khái niệm gia đình</h3>
        <p>Là một hình thức cộng đồng xã hội đặc biệt, được hình thành, duy trì và củng cố chủ yếu dựa trên cơ sở hôn nhân, quan hệ huyết thống và quan hệ nuôi dưỡng.</p>
  
        <h3>2. Xây dựng gia đình trong thời kỳ quá độ</h3>
        <p>Thực hiện hôn nhân tiến bộ, một vợ một chồng, vợ chồng bình đẳng.</p>
      `,
  },
  {
    id: 6,
    title: 'Con đường đi lên CNXH ở Việt Nam',
    description:
      'Đặc điểm của thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam và những phương hướng cơ bản.',
    content: `
      <h3>1. Đặc điểm quá độ ở Việt Nam</h3>
      <p>Quá độ lên chủ nghĩa xã hội bỏ qua chế độ tư bản chủ nghĩa.</p>

      <h3>2. Những phương hướng cơ bản</h3>
      <p>- Đẩy mạnh công nghiệp hóa, hiện đại hóa gắn với phát triển kinh tế tri thức.<br/>
      - Phát triển nền kinh tế thị trường định hướng xã hội chủ nghĩa.<br/>
      - Xây dựng nền văn hóa tiên tiến, đậm đà bản sắc dân tộc.</p>
    `,
  },
];

export default courseModules;
