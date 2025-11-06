export default function FeaturesSection() {
  const features = [
    {
      number: "01",
      title: "Eco-Friendly",
      description: "Sustainable products crafted with care for people and the planet."
    },
    {
      number: "02",
      title: "Recycled Materials",
      description: "Giving new life to discarded materials through creativity and purpose."
    },
    {
      number: "03",
      title: "Supporting Communities",
      description: "Every purchase uplifts local programs and empowers livelihood initiatives."
    }
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-full mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Welcome to BJMP-CAR SHOP
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover a unique collection of products handcrafted with care by the BJMP-CAR. Shop responsibly and support a meaningful cause while getting beautiful, eco-friendly bags made from recycled materials.
          </p>
        </div>
        <hr className="my-8 border-gray-200" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.number} className="text-left">
              <div className="text-gray-400 text-sm font-medium mb-3">
                {feature.number}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
