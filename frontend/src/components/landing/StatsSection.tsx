const stats = [
  {
    value: "+١,٠٠٠",
    label: "شرح فيديو",
  },
  {
    value: "٩٨٪",
    label: "نسبة الرضا",
  },
  {
    value: "+٨٠",
    label: "معلم متخصص",
  },
  {
    value: "+٤٥,٠٠٠",
    label: "تمرين محلول",
  },
];

const StatsSection = () => {
  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <span className="text-3xl font-extrabold text-[#003366] md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-medium text-gray-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;