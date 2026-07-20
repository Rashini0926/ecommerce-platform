import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">

      <div className="container">

        <div className="row">

          {/* Company */}

          <div className="col-lg-4 col-md-6 mb-4">

            <h3 className="fw-bold text-primary">
              ShopEase
            </h3>

            <p className="mt-3">
              ShopEase is your trusted online shopping destination,
              offering quality products at affordable prices with
              secure payments and fast islandwide delivery.
            </p>

          </div>

          {/* Quick Links */}

          <div className="col-lg-2 col-md-6 mb-4">

            <h5 className="mb-3">
              Quick Links
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <Link
                  to="/"
                  className="text-light text-decoration-none"
                >
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/products"
                  className="text-light text-decoration-none"
                >
                  Products
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/login"
                  className="text-light text-decoration-none"
                >
                  Login
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/register"
                  className="text-light text-decoration-none"
                >
                  Register
                </Link>
              </li>

            </ul>

          </div>

          {/* Customer Service */}

          <div className="col-lg-3 col-md-6 mb-4">

            <h5 className="mb-3">
              Customer Service
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                Help Center
              </li>

              <li className="mb-2">
                Privacy Policy
              </li>

              <li className="mb-2">
                Terms & Conditions
              </li>

              <li className="mb-2">
                Return Policy
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div className="col-lg-3 col-md-6 mb-4">

            <h5 className="mb-3">
              Contact Us
            </h5>

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

              <a
                href="#"
                className="text-light me-3"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="#"
                className="text-light me-3"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="text-light me-3"
              >
                <FaTwitter size={20} />
              </a>

              <a
                href="#"
                className="text-light"
              >
                <FaLinkedinIn size={20} />
              </a>

            </div>

          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center">

          <p className="mb-0">
            © {new Date().getFullYear()} ShopEase. All Rights Reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;