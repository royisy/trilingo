import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <>
            <h1>Error</h1>
            <p>Something went wrong...</p>
            <p><Link to="/">Home</Link></p>
        </>
    );
}