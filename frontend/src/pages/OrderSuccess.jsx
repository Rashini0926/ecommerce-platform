import { Link } from "react-router-dom";


function OrderSuccess() {


  const orderId = "ORD10234";


  return (

    <div className="container py-5">


      <div className="card shadow-sm border-0 text-center p-5">


        <div className="mb-4">

          <div
            className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center"
            style={{
              width:"80px",
              height:"80px",
              fontSize:"40px"
            }}
          >
            ✓
          </div>

        </div>



        <h2 className="fw-bold text-success">
          Order Placed Successfully!
        </h2>



        <p className="text-muted mt-3">
          Thank you for your purchase. Your order has been received.
        </p>



        <div className="card bg-light border-0 mt-4">


          <div className="card-body">


            <h5>
              Order Details
            </h5>


            <hr/>


            <div className="d-flex justify-content-between mb-2">

              <span>
                Order ID
              </span>


              <strong>
                #{orderId}
              </strong>


            </div>



            <div className="d-flex justify-content-between mb-2">

              <span>
                Payment Method
              </span>


              <strong>
                Cash on Delivery
              </strong>


            </div>



            <div className="d-flex justify-content-between">

              <span>
                Total Amount
              </span>


              <strong className="text-primary">
                Rs. 17,500
              </strong>


            </div>



          </div>


        </div>





        <div className="mt-4">


          <Link
            to="/orders"
            className="btn btn-primary me-2"
          >
            View My Orders
          </Link>



          <Link
            to="/products"
            className="btn btn-outline-secondary"
          >
            Continue Shopping
          </Link>



        </div>



      </div>


    </div>

  );

}


export default OrderSuccess;