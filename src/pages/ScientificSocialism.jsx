import React from 'react';
import Navbar from '../components/Navbar';
import AnimatedTitle from '../components/AnimatedTitle';

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
      {/* Hero Section */}
      <header id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        <div className="relative z-10 text-center px-4 space-y-6">
          <AnimatedTitle
            title="Chủ Nghĩa <br /> Xã Hội Khoa Học"
            containerClass="!text-red-600"
          />
          <p className="text-lg md:text-xl lg:text-2xl text-text mb-4 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-atkinson)' }}>
            Khóa học nền tảng về tư tưởng và lý luận
          </p>
        </div>
      </header>

      {/* Course Introduction Section */}
      <section id="introduction" className="py-16 md:py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedTitle title="Giới thiệu về khóa học" containerClass="!text-red-600" />
            <p className="text-base md:text-lg text-text leading-relaxed text-left">
              Chủ nghĩa xã hội khoa học là một trong ba bộ phận hợp thành của chủ nghĩa Mác - Lênin. Theo nghĩa rộng, đây là sự luận giải từ các góc độ triết học, kinh tế chính trị học và chính trị - xã hội về sự chuyển biến tất yếu của xã hội loài người từ chủ nghĩa tư bản lên chủ nghĩa xã hội và chủ nghĩa cộng sản.
              <br/><br/>
              Môn học này tập trung nghiên cứu những quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển của hình thái kinh tế - xã hội cộng sản chủ nghĩa. Mục tiêu cốt lõi là giải phóng giai cấp, giải phóng dân tộc và giải phóng con người, tạo điều kiện để con người phát triển toàn diện. Đây là "vũ khí lý luận" của giai cấp công nhân trong cuộc đấu tranh xóa bỏ áp bức, bóc lột và xây dựng xã hội mới.
            </p>
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      <section id="content" className="py-16 md:py-24 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AnimatedTitle title="Nội dung khóa học" containerClass="!text-red-600" />
            <p className="text-base md:text-lg text-text max-w-2xl mx-auto">
              Khám phá các chủ đề cốt lõi của Chủ nghĩa xã hội khoa học qua các chuyên đề sau.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseModules.map((module) => (
              <div key={module.id} className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <span className="text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-atkinson)' }}>
                  Chuyên đề {module.id}
                </span>
                <h3 className="text-xl font-bold text-text mt-2 mb-3" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  {module.title}
                </h3>
                <p className="text-base text-text leading-relaxed">
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-16 md:py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AnimatedTitle title="Dòng thời gian" containerClass="!text-red-600" />
            <p className="text-base md:text-lg text-text max-w-2xl mx-auto">
              Lịch sử hình thành và phát triển của chủ nghĩa xã hội khoa học qua các cột mốc quan trọng.
            </p>
          </div>
          <div className="relative wrap overflow-hidden p-10 h-full">
            <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border" style={{left: '50%'}}></div>
            {timelineEvents.map((event, index) => (
              <div key={event.id} className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}>
                <div className="order-1 w-5/12"></div>
                <div className="z-20 flex items-center order-1 bg-red-600 shadow-xl w-8 h-8 rounded-full">
                  <h1 className="mx-auto font-semibold text-sm text-white">{event.id}</h1>
                </div>
                <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
                  <p className="text-sm font-medium text-primary">{event.date}</p>
                  <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
                  <p className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Concepts Section */}
      <section id="concepts" className="py-16 md:py-24 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AnimatedTitle title="Các khái niệm cốt lõi" containerClass="!text-red-600" />
            <p className="text-base md:text-lg text-text max-w-2xl mx-auto">
              Hệ tư tưởng này được xây dựng dựa trên các khái niệm và phạm trù nền tảng sau.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyConcepts.map((concept) => (
              <div key={concept.id} className="bg-white border-t-4 border-primary rounded-b-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-text mb-3" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  {concept.title}
                </h3>
                <p className="text-base text-text leading-relaxed">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Instructor Section */}
      <section id="instructor" className="py-16 md:py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-200">
              {/* Placeholder for instructor image */}
              <img src="https://via.placeholder.com/256" alt="Instructor" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left max-w-lg">
            <AnimatedTitle title="Giảng viên" containerClass="!text-red-600" />
              <h3 className="text-xl font-bold text-primary mb-2">Thầy Lê Minh Trí</h3>
              <p className="text-base text-text leading-relaxed">
                Với hơn 100 năm kinh nghiệm giảng dạy và nghiên cứu về chủ nghĩa Mác - Lênin, Thầy Lê Minh Trí sẽ mang đến cho bạn những bài giảng sâu sắc, dễ hiểu và gắn liền với thực tiễn Việt Nam. Cùng những game tương tác thú vị, thầy sẽ giúp bạn nắm vững kiến thức và áp dụng hiệu quả vào cuộc sống.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-100">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Khóa học Chủ nghĩa xã hội khoa học. All Rights Reserved.</p>
        </div>
      </footer>

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
