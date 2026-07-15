function Login() {

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="text-center mb-4">
                Login
              </h2>


              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email Address"
              />


              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
              />


              <button className="btn btn-primary w-100">
                Login
              </button>


            </div>

          </div>

        </div>

      </div>

    </div>

  );
}


export default Login;