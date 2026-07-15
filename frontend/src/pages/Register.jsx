function Register() {

return (

<div className="container mt-5">

<div className="row justify-content-center">

<div className="col-md-5">


<div className="card shadow">

<div className="card-body">


<h2 className="text-center mb-4">
Create Account
</h2>


<input
className="form-control mb-3"
placeholder="Full Name"
/>


<input
className="form-control mb-3"
placeholder="Email Address"
/>


<input
type="password"
className="form-control mb-3"
placeholder="Password"
/>


<input
type="password"
className="form-control mb-3"
placeholder="Confirm Password"
/>


<button className="btn btn-success w-100">
Register
</button>


</div>

</div>


</div>

</div>


</div>

);

}

export default Register;