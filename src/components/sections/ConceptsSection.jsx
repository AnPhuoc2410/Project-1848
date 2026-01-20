import PropTypes from 'prop-types';

const ConceptsSection = ({ concepts }) => {
  return (
    <section id="concepts" className="py-16 md:py-24 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-text mb-4"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Các khái niệm cốt lõi
          </h2>
          <p className="text-base md:text-lg text-text max-w-2xl mx-auto">
            Hệ tư tưởng này được xây dựng dựa trên các khái niệm và phạm trù nền
            tảng sau.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="bg-white border-t-4 border-primary rounded-b-lg shadow-lg p-6"
            >
              <h3
                className="text-lg font-bold text-text mb-3"
                style={{ fontFamily: 'var(--font-crimson-pro)' }}
              >
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
  );
};

ConceptsSection.propTypes = {
  concepts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ConceptsSection;
