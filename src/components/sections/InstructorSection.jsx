const InstructorSection = () => {
  const members = [
    {
      name: 'Lê Trung Anh Khôi',
      mssv: 'SE180591',
      img: 'https://via.placeholder.com/160',
    },
    {
      name: 'Hoàng Quốc An',
      mssv: 'SE181520',
      img: 'https://via.placeholder.com/160',
    },
    {
      name: 'Đào Công An Phước',
      mssv: 'SE180581',
      img: 'https://via.placeholder.com/160',
    },
    {
      name: 'Vũ Hoàng Hiếu Ngân',
      mssv: 'SE183096',
      img: 'https://via.placeholder.com/160',
    },
    {
      name: 'Trần Đình Thịnh',
      mssv: 'SE181531',
      img: 'https://via.placeholder.com/160',
    },
    {
      name: 'Hoàng Gia Phong',
      mssv: 'SE181531',
      img: 'https://via.placeholder.com/160',
    },
  ];

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
            {members.map((member) => (
              <div key={member.name} className="flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-primary text-lg">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm">{member.mssv}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
