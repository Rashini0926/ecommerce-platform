import { useState } from "react";
import { Link } from "react-router-dom";


function Checkout() {


  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");


  // Temporary data - will later come from cart/backend
  const orderItems = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 8500,
      quantity: 1,
      image: null
    },
    {
      id: 2,
      name: "Gaming Mouse RGB",
      price: 4500,
      quantity: 2,
      image: null
    }
  ];


  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );


  const shipping = 0;


  const total = subtotal + shipping;



  return (

    <div className="container py-5">


      <h2 className="fw-bold mb-4">
        Checkout
      </h2>



      <div className="row g-4">



        {/* DELIVERY INFORMATION */}

        <div className="col-lg-7">


          <div className="card shadow-sm border-0">


            <div className="card-body">


              <h4 className="mb-4">
                Delivery Information
              </h4>



              <div className="row g-3">


                <div className="col-md-6">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                  />

                </div>



                <div className="col-md-6">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />

                </div>



                <div className="col-md-6">

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter phone number"
                  />

                </div>



                <div className="col-md-6">

                  <label className="form-label">
                    City
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city"
                  />

                </div>



                <div className="col-12">

                  <label className="form-label">
                    Delivery Address
                  </label>


                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Enter complete address"
                  />


                </div>


              </div>


            </div>


          </div>





          {/* PAYMENT METHOD */}


          <div className="card shadow-sm border-0 mt-4">


            <div className="card-body">


              <h4 className="mb-3">
                Payment Method
              </h4>




              <div className="form-check mb-3">


                <input
                  className="form-check-input"
                  type="radio"
                  value="Cash on Delivery"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={(e)=>setPaymentMethod(e.target.value)}
                />


                <label className="form-check-label">
                  Cash on Delivery
                </label>


              </div>





              <div className="form-check">


                <input
                  className="form-check-input"
                  type="radio"
                  value="Card Payment"
                  checked={paymentMethod === "Card Payment"}
                  onChange={(e)=>setPaymentMethod(e.target.value)}
                />


                <label className="form-check-label">
                  Card Payment
                </label>


              </div>



            </div>


          </div>


        </div>





        {/* ORDER SUMMARY */}


        <div className="col-lg-5">


          <div
            className="card shadow-sm border-0 sticky-top"
            style={{top:"90px"}}
          >


            <div className="card-body">


              <h4 className="mb-4">
                Order Summary
              </h4>




              {
                orderItems.map(item => (


                  <div
                    key={item.id}
                    className="d-flex align-items-center mb-3"
                  >



                    {/* Product image placeholder */}

                    <div
                      className="bg-light rounded me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width:"70px",
                        height:"70px"
                      }}
                    >

                      {/* Image will be added here later */}

                    </div>




                    <div className="flex-grow-1">


                      <h6 className="mb-1">
                        {item.name}
                      </h6>


                      <small className="text-muted">
                        Quantity: {item.quantity}
                      </small>


                    </div>




                    <strong>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </strong>



                  </div>


                ))

              }





              <hr/>




              <div className="d-flex justify-content-between mb-2">

                <span>
                  Subtotal
                </span>


                <strong>
                  Rs. {subtotal.toLocaleString()}
                </strong>


              </div>





              <div className="d-flex justify-content-between mb-2">

                <span>
                  Shipping
                </span>


                <span className="text-success">
                  Free
                </span>


              </div>





              <hr/>




              <div className="d-flex justify-content-between">


                <h5>
                  Total
                </h5>


                <h5 className="text-primary">
                  Rs. {total.toLocaleString()}
                </h5>


              </div>






              {/* Navigate to Order Success */}

              <Link
                to="/order-success"
                className="btn btn-success w-100 mt-4"
              >
                Place Order
              </Link>






              <Link
                to="/cart"
                className="btn btn-outline-secondary w-100 mt-2"
              >
                Back to Cart
              </Link>




            </div>


          </div>


        </div>


      </div>


    </div>

  );

}


export default Checkout;