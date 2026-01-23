const InstructorSection = () => {
  return (
    <section
      id="instructor"
      className="relative py-16 md:py-24 scroll-mt-16 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-text mb-8 text-center"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Thành viên nhóm
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl">
            {/* Member 1 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/160"
                  alt="Thành viên 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-primary text-lg">Thành viên 1</h3>
              <p className="text-gray-600 text-sm">MSSV: ...</p>
            </div>

            {/* Member 2 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/160"
                  alt="Thành viên 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-primary text-lg">Thành viên 2</h3>
              <p className="text-gray-600 text-sm">MSSV: ...</p>
            </div>

            {/* Member 3 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/160"
                  alt="Thành viên 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-primary text-lg">Thành viên 3</h3>
              <p className="text-gray-600 text-sm">MSSV: ...</p>
            </div>

            {/* Member 4 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/160"
                  alt="Thành viên 4"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-primary text-lg">Thành viên 4</h3>
              <p className="text-gray-600 text-sm">MSSV: ...</p>
            </div>

            {/* Member 5 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/160"
                  alt="Thành viên 5"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-primary text-lg">Thành viên 5</h3>
              <p className="text-gray-600 text-sm">MSSV: ...</p>
            </div>

            {/* Member 6 */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/160"
                  alt="Thành viên 6"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-primary text-lg">Thành viên 6</h3>
              <p className="text-gray-600 text-sm">MSSV: ...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
