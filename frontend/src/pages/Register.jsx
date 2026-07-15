function Register() {
  return (
    <div className="container mt-5">

      <h2>Create Account</h2>

      <input
        className="form-control mb-3"
        placeholder="Name"
      />

      <input
        className="form-control mb-3"
        placeholder="Email"
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Password"
      />

      <button className="btn btn-success">
        Register
      </button>

    </div>
  );
}

export default Register;