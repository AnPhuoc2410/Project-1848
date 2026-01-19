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
    {
      id: 1,
      date: 'Những năm 40 của thế kỷ XIX',
      title: 'Cách mạng công nghiệp',
      description: 'Phát triển mạnh mẽ, tạo ra nền đại công nghiệp và sự ra đời của giai cấp công nhân.',
      image: '/img/entrance.png',
    },
    {
      id: 2,
      date: '1831 & 1834',
      title: 'Phong trào công nhân dệt ở Li-on (Pháp)',
      description: 'Bùng nổ, chuyển từ mục đích kinh tế sang chính trị với khẩu hiệu "Cộng hòa hay là chết".',
      image: '/img/contact-1.jpg',
    },
    {
      id: 3,
      date: '1836 - 1848',
      title: 'Phong trào Hiến chương ở Anh',
      description: 'Diễn ra quy mô rộng khắp của những người lao động.',
      image: '/img/contact-2.png',
    },
    {
      id: 4,
      date: 'Tháng 2 năm 1848',
      title: 'Tuyên ngôn của Đảng Cộng sản',
      description: 'Đánh dấu sự ra đời chính thức của chủ nghĩa xã hội khoa học.',
      image: '/img/contact.jpg',
    },
    {
      id: 5,
      date: '1871',
      title: 'Công xã Pari',
      description: 'Hình thái nhà nước đầu tiên của giai cấp công nhân ra đời.',
      image: '/img/about.jpg',
    },
    {
      id: 6,
      date: '1917',
      title: 'Cách mạng Tháng Mười Nga',
      description: 'Thành công, biến chủ nghĩa xã hội từ lý luận thành hiện thực với Nhà nước Xô viết.',
      image: '/img/entrance.png',
    },
    {
      id: 7,
      date: '1924 - 1953',
      title: 'Thời đoạn Xtalin',
      description: 'Liên Xô trở thành một cường quốc xã hội chủ nghĩa.',
      image: '/img/contact-1.jpg',
    },
    {
      id: 8,
      date: '1978',
      title: 'Cải cách, mở cửa ở Trung Quốc',
      description: 'Xây dựng chủ nghĩa xã hội đặc sắc Trung Quốc.',
      image: '/img/contact-2.png',
    },
    {
      id: 9,
      date: '1986',
      title: 'Công cuộc Đổi mới ở Việt Nam',
      description: 'Vận dụng sáng tạo chủ nghĩa xã hội khoa học vào điều kiện cụ thể.',
      image: '/img/contact.jpg',
    },
    {
      id: 10,
      date: 'Cuối thập niên 80 - đầu 90',
      title: 'Sụp đổ ở Liên Xô và Đông Âu',
      description: 'Mô hình chủ nghĩa xã hội sụp đổ, đánh dấu giai đoạn thử thách.',
      image: '/img/logo.png',
    },
  ];


  return (
    <div className="relative antialiased bg-background text-text">
      <Navbar />
      <HeroSection />
      <About />
      <CourseContentSection modules={courseModules} />
      <TimelineSection events={timelineEvents} />
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
