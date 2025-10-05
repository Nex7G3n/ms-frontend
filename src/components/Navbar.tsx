import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">AutoPartes Manager</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/autopartes">Autopartes</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/marcas">Marcas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/modelos">Modelos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/piezas">Piezas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/clientes">Clientes</NavLink></li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" />
            <button className="btn btn-outline-light" type="submit">Buscar</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
