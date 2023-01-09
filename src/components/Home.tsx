import { Link } from "react-router-dom";

export function Home() {
    return (
        <>
            <h1>Trilingo</h1>
            <p><Link to="menu">Menu</Link></p>
        </>
    );
}
