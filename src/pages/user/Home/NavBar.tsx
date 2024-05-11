
function NavBar() {
  return (
    <nav className="bg-black text-white flex justify-between items-center p-6">
    <div className="flex items-center space-x-4">
      <img src="/images/images__1_-removebg-preview.png" alt="Logo" className="h-16 w-auto" /> {/* Increased logo size */}
      <div className="space-x-4">
        <a href="#" className="hover:text-gray-300">Ride</a>
        <a href="#" className="hover:text-gray-300">Drive</a>
        <a href="#" className="hover:text-gray-300">About</a>
      </div>
    </div>
    <div className="flex items-center space-x-8"> {/* Increased spacing between links */}
      <a href="#" className="hover:text-gray-300">Help</a>
      <a href="#" className="hover:text-gray-300">Login</a>
      <a href="#" className="hover:text-gray-300">Sign Up</a>
    </div>
  </nav>
  )
}

export default NavBar
