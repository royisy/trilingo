import { Link } from "react-router-dom";

export default function Menu() {
    return (
        <>
            <h1>Menu</h1>
            <p><Link to="/">Home</Link></p>
            <p><Link to="add-deck">Add deck</Link></p>
        </>
    );
}
