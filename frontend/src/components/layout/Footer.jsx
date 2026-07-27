import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h3 className="fw-bold text-primary">ShopEase</h3>

            <p className="mt-3">
              Your trusted online shopping destination for quality products,
              secure payments, and fast islandwide delivery.
            </p>

            <span className="badge badge-soft-primary mt-2">
              <FaShieldAlt className="me-2" />
              Buyer protection included
            </span>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="mb-3 text-white">Quick Links</h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none">
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/products" className="text-decoration-none">
                  Products
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/register" className="text-decoration-none">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="mb-3 text-white">Customer Service</h5>

            <ul className="list-unstyled">
              <li className="mb-2">Help Center</li>
              <li className="mb-2">Privacy Policy</li>
              <li className="mb-2">Terms & Conditions</li>
              <li className="mb-2">Return Policy</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="mb-3 text-white">Contact Us</h5>

            <p>
              <FaMapMarkerAlt className="me-2 text-primary" />
              Colombo, Sri Lanka
            </p>

            <p>
              <FaPhoneAlt className="me-2 text-primary" />
              +94 77 123 4567
            </p>

            <p>
              <FaEnvelope className="me-2 text-primary" />
              support@shopease.com
            </p>

            <div className="mt-3">
              <a href="#" className="social-link me-2" aria-label="Facebook">
                <FaFacebookF size={18} />
              </a>

              <a href="#" className="social-link me-2" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>

              <a href="#" className="social-link me-2" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>

              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center">
          <p className="mb-0">
            Copyright {new Date().getFullYear()} ShopEase. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
