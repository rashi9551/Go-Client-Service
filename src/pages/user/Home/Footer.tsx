function Footer() {
  return (
    <div>
      <footer className="bg-black text-white py-6 ">
        <div className="">
          <img
            src="/images/images__1_-removebg-preview.png"
            alt="Logo"
            className="w-[10%]"
          />
        </div>
        <div className="container mx-[30%] flex items-center justify-between">
          <div className="flex space-x-40">
            <div className="">
              {" "}
              {/* Increased margin from mr-8 to mr-12 */}
              <h4 className="text-xl font-semibold mb-5">Company</h4>
              <ul className="space-y-5">
                <li>About Us</li>
                <li>Our Offices</li>
                <li>Newsroom</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="">
              {" "}
              {/* Increased margin from mr-8 to mr-12 */}
              <h4 className="text-xl font-semibold mb-5">Products</h4>
              <ul className="space-y-5">
                <li>Ride</li>
                <li>Drive</li>
                <li>Go for Business</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="">
              <h4 className="text-xl font-semibold mb-5">Travel</h4>
              <ul className="space-y-5">
                <li>Safety</li>
                <li>Insurance</li>
                <li>Sustainability</li>
                <li>Airports</li>
              </ul>
            </div>
          </div>
        </div>
        <aside className="mt-10 ml-5">
          <h6>Copyright © 2023 - All right reserved by Go Industries Ltd</h6>
        </aside>
      </footer>
    </div>
  );
}

export default Footer;
