
import { Link } from "react-router-dom";

export default function NoMatch() {
    return (
        <>
            <h1>Not Found</h1>
            <p><Link to="/">Home</Link></p>
        </>
    );
}
