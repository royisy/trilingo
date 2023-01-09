
import { Link } from "react-router-dom";

export function NoMatch() {
    return (
        <>
            <h1>Not Found</h1>
            <p><Link to="/">Home</Link></p>
        </>
    );
}
