import Navbar from '../components/Navbar';
import HeroSection from '../components/sections/HeroSection';
import CourseContentSection from '../components/sections/CourseContentSection';
import TimelineSection from '../components/sections/TimelineSection';
import InstructorSection from '../components/sections/InstructorSection';
import FooterSection from '../components/sections/FooterSection';
import About from '../components/About';
import courseModules from '../data/courseModules';

const ScientificSocialism = () => {
  const timelineEvents = [
    {
      id: 1,
      date: 'Những năm 40 của thế kỷ XIX',
      title: 'Cách mạng công nghiệp',
      description:
        'Phát triển mạnh mẽ, tạo ra nền đại công nghiệp và sự ra đời của giai cấp công nhân.',
      image: '/img/Cuoc-cach-mang-cong-nghiep.png',
    },
    {
      id: 2,
      date: '1831 & 1834',
      title: 'Phong trào công nhân dệt ở Li-on (Pháp)',
      description:
        'Bùng nổ, chuyển từ mục đích kinh tế sang chính trị với khẩu hiệu "Cộng hòa hay là chết".',
      image: '/img/phong-trao-cong-nhan-det.jpg',
    },
    {
      id: 3,
      date: '1836 - 1848',
      title: 'Phong trào Hiến chương ở Anh',
      description: 'Diễn ra quy mô rộng khắp của những người lao động.',
      image: '/img/cong-dan-Anh-dua-hien-chuong-den-quoc-hoi.jpg',
    },
    {
      id: 4,
      date: 'Tháng 2 năm 1848',
      title: 'Tuyên ngôn của Đảng Cộng sản',
      description:
        'Đánh dấu sự ra đời chính thức của chủ nghĩa xã hội khoa học.',
      image: '/img/tuyen-ngon-dang-cong-san.jpg',
    },
    {
      id: 5,
      date: '1871',
      title: 'Công xã Pari',
      description: 'Hình thái nhà nước đầu tiên của giai cấp công nhân ra đời.',
      image: '/img/cong-xa-pa-ri-nam-1871.png',
    },
    {
      id: 6,
      date: '1917',
      title: 'Cách mạng Tháng Mười Nga',
      description:
        'Thành công, biến chủ nghĩa xã hội từ lý luận thành hiện thực với Nhà nước Xô viết.',
      image: '/img/cach-mang-thang-10-nga.jpg',
    },
    {
      id: 7,
      date: '1924 - 1953',
      title: 'Thời đoạn Xtalin',
      description: 'Liên Xô trở thành một cường quốc xã hội chủ nghĩa.',
      image: '/img/stalin.jpg',
    },
    {
      id: 8,
      date: '1978',
      title: 'Cải cách, mở cửa ở Trung Quốc',
      description: 'Xây dựng chủ nghĩa xã hội đặc sắc Trung Quốc.',
      image: '/img/1978.jpeg',
    },
    {
      id: 9,
      date: '1986',
      title: 'Công cuộc Đổi mới ở Việt Nam',
      description:
        'Vận dụng sáng tạo chủ nghĩa xã hội khoa học vào điều kiện cụ thể.',
      image: '/img/1986.jpg',
    },
    {
      id: 10,
      date: 'Cuối thập niên 80 - đầu 90',
      title: 'Sụp đổ ở Liên Xô và Đông Âu',
      description:
        'Mô hình chủ nghĩa xã hội sụp đổ, đánh dấu giai đoạn thử thách.',
      image: '/img/80-90-fall-of-lien-xo.jpg',
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
    </div>
  );
};

export default ScientificSocialism;
