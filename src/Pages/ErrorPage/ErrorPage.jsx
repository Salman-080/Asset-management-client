import { Helmet } from "react-helmet-async";


const ErrorPage = () => {
    return (
        <div>
            <Helmet>
                    <title>Page Not Found</title>
                </Helmet>
                <h2>Page Not Found</h2>
        </div>
    );
};

export default ErrorPage;