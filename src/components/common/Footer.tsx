// Footer component

export default function Footer() {
  return (
    <footer className="bg-orange-300 text-gray-800 mt-16 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-700">About Us</h2>
            <p className="text-gray-600 mt-2">
              We are a handcrafted goods marketplace, connecting artisans with
              customers worldwide.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-700">Contact</h2>
            <ul className="mt-2 text-gray-600">
              <li>Email: support@handcrafthaven.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Artisan Lane, Craftsville</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="text-lg font-bold text-gray-700">Follow Us</h2>
            <ul className="flex space-x-4 mt-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-700">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-700">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-700">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
