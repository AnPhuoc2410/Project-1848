import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/sections/HeroSection';
import IntroductionSection from '../components/sections/IntroductionSection';
import CourseContentSection from '../components/sections/CourseContentSection';
import TimelineSection from '../components/sections/TimelineSection';
import ConceptsSection from '../components/sections/ConceptsSection';
import InstructorSection from '../components/sections/InstructorSection';
import FooterSection from '../components/sections/FooterSection';
import About from '../components/About';

const ScientificSocialism = () => {
  const courseModules = [
    {
      id: 1,
      title: 'Nhập môn Chủ nghĩa xã hội khoa học',
      description: 'Đối tượng, phương pháp và ý nghĩa của việc học tập, nghiên cứu chủ nghĩa xã hội khoa học.',
    },
    {
      id: 2,
      title: 'Sứ mệnh lịch sử của giai cấp công nhân',
      description: 'Nội dung và những điều kiện khách quan quy định sứ mệnh lịch sử của giai cấp công nhân.',
    },
    {
      id: 3,
      title: 'Chủ nghĩa xã hội và thời kỳ quá độ',
      description: 'Những đặc trưng cơ bản của chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội.',
    },
    {
      id: 4,
      title: 'Vấn đề dân tộc và tôn giáo',
      description: 'Chủ nghĩa Mác - Lênin về vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội.',
    },
    {
      id: 5,
      title: 'Vấn đề gia đình',
      description: 'Xây dựng gia đình kiểu mới xã hội chủ nghĩa và các giá trị gia đình trong xã hội hiện đại.',
    },
    {
      id: 6,
      title: 'Con đường đi lên CNXH ở Việt Nam',
      description: 'Đặc điểm của thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam và những phương hướng cơ bản.',
    },
  ];

  const timelineEvents = [
    { id: 1, date: 'Những năm 40 của thế kỷ XIX', title: 'Cách mạng công nghiệp', description: 'Phát triển mạnh mẽ, tạo ra nền đại công nghiệp và sự ra đời của giai cấp công nhân.' },
    { id: 2, date: '1831 & 1834', title: 'Phong trào công nhân dệt ở Li-on (Pháp)', description: 'Bùng nổ, chuyển từ mục đích kinh tế sang chính trị với khẩu hiệu "Cộng hòa hay là chết".' },
    { id: 3, date: '1836 - 1848', title: 'Phong trào Hiến chương ở Anh', description: 'Diễn ra quy mô rộng khắp của những người lao động.' },
    { id: 4, date: 'Tháng 2 năm 1848', title: 'Tuyên ngôn của Đảng Cộng sản', description: 'Đánh dấu sự ra đời chính thức của chủ nghĩa xã hội khoa học.' },
    { id: 5, date: '1871', title: 'Công xã Pari', description: 'Hình thái nhà nước đầu tiên của giai cấp công nhân ra đời.' },
    { id: 6, date: '1917', title: 'Cách mạng Tháng Mười Nga', description: 'Thành công, biến chủ nghĩa xã hội từ lý luận thành hiện thực với Nhà nước Xô viết.' },
    { id: 7, date: '1924 - 1953', title: 'Thời đoạn Xtalin', description: 'Liên Xô trở thành một cường quốc xã hội chủ nghĩa.' },
    { id: 8, date: '1978', title: 'Cải cách, mở cửa ở Trung Quốc', description: 'Xây dựng chủ nghĩa xã hội đặc sắc Trung Quốc.' },
    { id: 9, date: '1986', title: 'Công cuộc Đổi mới ở Việt Nam', description: 'Vận dụng sáng tạo chủ nghĩa xã hội khoa học vào điều kiện cụ thể.' },
    { id: 10, date: 'Cuối thập niên 80 - đầu 90', title: 'Sụp đổ ở Liên Xô và Đông Âu', description: 'Mô hình chủ nghĩa xã hội sụp đổ, đánh dấu giai đoạn thử thách.' },
  ];

  const keyConcepts = [
    { id: 1, title: 'Ba phát kiến vĩ đại', description: 'Bao gồm Chủ nghĩa duy vật lịch sử, Học thuyết giá trị thặng dư và Học thuyết về sứ mệnh lịch sử toàn thế giới của giai cấp công nhân.' },
    { id: 2, title: 'Sứ mệnh lịch sử của giai cấp công nhân', description: 'Phạm trù trung tâm, khẳng định giai cấp công nhân là lực lượng tiên phong xóa bỏ chế độ tư bản và xây dựng xã hội cộng sản.' },
    { id: 3, title: 'Thời kỳ quá độ lên chủ nghĩa xã hội', description: 'Thời kỳ cải biến cách mạng sâu sắc, triệt để và lâu dài để xây dựng cơ sở vật chất - kỹ thuật cho chủ nghĩa xã hội.' },
    { id: 4, title: 'Dân chủ xã hội chủ nghĩa', description: 'Nền dân chủ cao hơn về chất so với dân chủ tư sản, nơi mọi quyền lực thực sự thuộc về nhân dân.' },
    { id: 5, title: 'Nhà nước pháp quyền xã hội chủ nghĩa', description: 'Nhà nước của nhân dân, do nhân dân và vì nhân dân, quản lý bằng Hiến pháp và pháp luật.' },
    { id: 6, title: 'Liên minh giai cấp', description: 'Sự gắn bó giữa giai cấp công nhân, nông dân và trí thức, là nền tảng cho khối đại đoàn kết toàn dân tộc.' },
    { id: 7, title: 'Gia đình xã hội chủ nghĩa', description: 'Được coi là "tế bào" của xã hội, là cầu nối giữa cá nhân với xã hội.' },
    { id: 8, title: 'Cương lĩnh dân tộc', description: 'Dựa trên ba nguyên tắc: Các dân tộc hoàn toàn bình đẳng, được quyền tự quyết và liên hiệp công nhân tất cả các dân tộc.' },
  ];

  return (
    <div className="relative antialiased bg-background text-text">
      <Navbar />
      <HeroSection />
      <About />
      <CourseContentSection modules={courseModules} />
      <TimelineSection events={timelineEvents} />
      <ConceptsSection concepts={keyConcepts} />
      <InstructorSection />
      <FooterSection />

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, var(--color-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .left-timeline {
          flex-direction: row-reverse;
        }
        .right-timeline {
          flex-direction: row;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ScientificSocialism;
