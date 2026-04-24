import React from "react";

const App: React.FC = () => {
  return (
    <div className="font-sans text-gray-800">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md">
        <h1 className="text-xl font-bold">TravelX</h1>
        <div className="space-x-6">
          <a href="#" className="hover:text-blue-500">Home</a>
          <a href="#" className="hover:text-blue-500">Destinations</a>
          <a href="#" className="hover:text-blue-500">About</a>
          <a href="#" className="hover:text-blue-500">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-[80vh] flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Explore the World with Us
        </h2>
        <p className="mb-6 text-lg">
          Discover amazing places at exclusive deals
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200">
          Get Started
        </button>
      </section>

      {/* Featured Destinations */}
      <section className="px-8 py-12">
        <h3 className="text-2xl font-bold text-center mb-8">
          Popular Destinations
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {["Bali", "Paris", "Maldives"].map((place) => (
            <div
              key={place}
              className="p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="h-40 bg-gray-300 rounded mb-4" />
              <h4 className="text-lg font-semibold">{place}</h4>
              <p className="text-sm text-gray-500">
                Beautiful destination to explore
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white text-center py-12">
        <h3 className="text-2xl font-bold mb-4">
          Ready for your next adventure?
        </h3>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200">
          Book Now
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-100 text-sm">
        © 2026 TravelX. All rights reserved.
      </footer>

    </div>
  );
};

export default App;