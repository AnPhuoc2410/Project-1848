const InstructorSection = () => {
  return (
    <section id="instructor" className="py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-200">
            <img
              src="https://via.placeholder.com/256"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left max-w-lg">
            <h2
              className="text-3xl md:text-4xl font-bold text-text mb-4"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              Giảng viên
            </h2>
            <h3 className="text-xl font-bold text-primary mb-2">
              Thầy Lê Minh Trí
            </h3>
            <p className="text-base text-text leading-relaxed">
              Với hơn 100 năm kinh nghiệm giảng dạy và nghiên cứu về chủ nghĩa
              Mác - Lênin, Thầy Lê Minh Trí sẽ mang đến cho bạn những bài giảng
              sâu sắc, dễ hiểu và gắn liền với thực tiễn Việt Nam. Cùng những
              game tương tác thú vị, thầy sẽ giúp bạn nắm vững kiến thức và áp
              dụng hiệu quả vào cuộc sống.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
