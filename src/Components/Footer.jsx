function Footer() {
    return (
        <>
            <footer className="text-center text-lg-start">
                <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                    © {new Date().getFullYear()} Copyright:
                    <a className="me-1 text-body" href="#"> <span className="text-primary">CS Project Management</span></a>
                </div>

            </footer>
        </>
    );
}

export default Footer;