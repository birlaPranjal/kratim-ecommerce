import React from 'react';

export default function JewelleryCare() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Jewellery Care: Essential Tips to Keep Your Pieces Sparkling</h1>
      
      <p className="text-lg text-gray-700 mb-8 text-center">
        Your jewellery is more than just an accessory—it's a reflection of your style, memories, and elegance. 
        To ensure your cherished pieces stay radiant and beautiful for years to come, follow these essential jewellery care tips:
      </p>

      <div className="space-y-8">
        {/* Store Properly Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">1. Store Properly</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-2xl mr-2">💎</span>
              <span>Separate Pieces: Keep each jewellery piece in a separate compartment to avoid scratches and tangling.</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">💎</span>
              <span>Use Soft Pouches & Boxes: Store your jewellery in soft-lined boxes or fabric pouches to protect delicate surfaces.</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">💎</span>
              <span>Avoid Humidity: Moisture can cause tarnishing; store your pieces in a dry place and consider adding silica gel packets to absorb excess moisture.</span>
            </li>
          </ul>
        </section>

        {/* Wear with Care Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">2. Wear with Care</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-2xl mr-2">✨</span>
              <span>Apply Cosmetics First: Perfumes, lotions, and hair products can dull jewellery. Apply them first and let them dry before wearing your jewellery.</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">✨</span>
              <span>Remove During Activities: Take off jewellery before swimming, exercising, or doing household chores to prevent exposure to chemicals, sweat, or accidental damage.</span>
            </li>
          </ul>
        </section>

        {/* Clean Regularly Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">3. Clean Regularly</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-2xl mr-2">🛁</span>
              <span>Gentle Cleaning: Use a soft brush, warm water, and mild soap for regular cleaning. Gently scrub, rinse, and pat dry with a soft cloth.</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🛁</span>
              <span>Professional Cleaning: Valuable or intricate pieces should be professionally cleaned at least once a year to maintain their brilliance.</span>
            </li>
          </ul>
        </section>

        {/* Avoid Harsh Chemicals Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">4. Avoid Harsh Chemicals</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-2xl mr-2">🚫</span>
              <span>Steer Clear of Bleach & Acids: Chemicals like bleach, acetone, and chlorine can tarnish and damage metals and gemstones.</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🚫</span>
              <span>Use a Soft Cloth: Always use a soft, lint-free cloth for polishing to prevent scratches and maintain shine.</span>
            </li>
          </ul>
        </section>

        {/* Check for Damage Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">5. Check for Damage</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-2xl mr-2">🔍</span>
              <span>Inspect for Wear & Tear: Regularly check for loose stones, worn clasps, or bent prongs to prevent further damage.</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-2">🔍</span>
              <span>Get Professional Repairs: If you notice any issues, consult a professional jeweller for repairs to ensure your jewellery remains secure and stunning.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
} 