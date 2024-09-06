export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200" data-testid="footer">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} AI Startups Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}