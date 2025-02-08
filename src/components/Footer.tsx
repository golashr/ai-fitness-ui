export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AI Fitness. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="/about"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              About
            </a>
            <a
              href="/terms"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
