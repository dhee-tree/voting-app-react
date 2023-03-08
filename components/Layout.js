import Nav from './Nav';

export default function Layout({ children }) {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <Nav />
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}