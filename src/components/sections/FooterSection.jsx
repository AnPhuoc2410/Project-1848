import React from 'react';

const FooterSection = () => {
  return (
    <footer className="py-6 bg-gray-100">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Khóa học Chủ nghĩa xã hội khoa học. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterSection;
