import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 bg-white">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
