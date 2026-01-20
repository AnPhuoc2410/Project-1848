import AnimatedTitle from '../AnimatedTitle';

const CourseContentSection = ({ modules }) => {
  return (
    <section id="content" className="py-16 md:py-24 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <AnimatedTitle
            title="NỘI DUNG <b>KHÓA</b> HỌC <br /> KẾT CẤU <b>CHUYÊN</b> ĐỀ"
            containerClass="mt-5 pointer-events-none text-text"
          />
          <p className="mt-6 text-base md:text-lg text-text max-w-2xl mx-auto">
            Khám phá các chủ đề cốt lõi của Chủ nghĩa xã hội khoa học qua các
            chuyên đề sau.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <div
              key={module.id}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white p-6 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.01] hover:border-primary/80 hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.55)]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 20% 20%, rgba(185,28,28,0.16), transparent 35%), radial-gradient(circle at 80% 30%, rgba(251,191,36,0.16), transparent 32%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.08), transparent 45%)',
                }}
              />
              <div className="pointer-events-none absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/80 via-white/70 to-white/60" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span
                className="relative text-sm font-bold text-primary"
                style={{ fontFamily: 'var(--font-atkinson)' }}
              >
                Chuyên đề {module.id}
              </span>
              <h3
                className="relative mt-2 mb-3 text-xl font-bold text-text transition-colors duration-500 group-hover:text-primary"
                style={{ fontFamily: 'var(--font-crimson-pro)' }}
              >
                {module.title}
              </h3>
              <p className="relative text-base leading-relaxed text-text transition-colors duration-500 group-hover:text-gray-800">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CourseContentSection.propTypes = {
//   modules: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       title: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

export default CourseContentSection;
