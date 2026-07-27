function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-4">

        <div className="row">

          <div className="col-md-4">
            <h5>ShopEase</h5>
            <p>
              Your trusted online shopping platform.
            </p>
          </div>


          <div className="col-md-4">
            <h5>Quick Links</h5>

            <ul className="list-unstyled">
              <li>Home</li>
              <li>Products</li>
              <li>About Us</li>
              <li>Contact</li>
            </ul>

          </div>


          <div className="col-md-4">
            <h5>Contact</h5>

            <p>Email: support@shopease.com</p>
            <p>Phone: +94 77 1234567</p>

          </div>

        </div>


        <hr />


        <p className="text-center mb-0">
          © 2026 ShopEase. All Rights Reserved.
        </p>


      </div>
    </footer>
  );
}

export default Footer;