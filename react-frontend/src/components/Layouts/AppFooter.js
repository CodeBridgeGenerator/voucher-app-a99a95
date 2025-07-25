const AppFooter = () => {
  return (
    <footer className="w-full py-3 text-center bg-gray-100 border-t text-sm text-gray-600">
      © {new Date().getFullYear()} Carter Bank. All rights reserved.
      <span className="mx-2">|</span>
      <a href="/privacy" className="text-link hover:underline">
        Privacy Policy
      </a>
      <span className="mx-2">|</span>
      <a href="/support" className="text-link hover:underline">
        Support
      </a>
    </footer>
  );
};
export default AppFooter;
