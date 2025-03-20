function Login()
{
    const formSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <>
            <div className="login">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="p-4">
                                <div className="card">
                                    
                                    <div className="card-body">
                                        <h4 className="mb-3">Login Page</h4>
                                        <form onSubmit={formSubmit}>
                                            <div className="row form-group">
                                                <div className="col-lg-12">
                                                    <label for="" className="mb-2"><i class="bi bi-envelope"></i> Email</label>
                                                    <input type="text" placeholder="Enter Email" name="Email" className="form-control" id="" />
                                                </div>
                                            </div>

                                            <div className="row form-group mt-2">
                                                <div className="col-lg-12">
                                                    <label for="" className="mb-2"><i class="bi bi-lock"></i> Password</label>
                                                    <input type="text" placeholder="**********" name="Password" className="form-control" id="" />
                                                </div>
                                            </div>

                                            <div className="row form-group mt-3">
                                                <div className="col-lg-12">
                                                    <button type="submit" className="btn btn-primary">Login</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;