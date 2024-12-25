import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import '../styles/Bodega.css';
import HelpButton from'../components/Help';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBox, faClipboard, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Bodega = () => {
    const [productos, setProductos] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', cantidad: '', unidadMedida: '' });
    const [nuevaReceta, setNuevaReceta] = useState({ nombre: '', ingredientes: [] });
    const [ingrediente, setIngrediente] = useState({ nombre: '', cantidad: '', unidadMedida: '' });
    const [activeMenu, setActiveMenu] = useState('productos');
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        if (!token) {
            navigate('/'); 
        }
    }, [token, navigate]);

    useEffect(() => {
        if (activeMenu === 'productos') {
            fetchProductos();
        } else {
            fetchRecetas();
        }
    }, [activeMenu]);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bodega', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            if (error.response && error.response.status === 401) {
                removeToken();
                navigate('/');
            }
        }
    };

    const fetchRecetas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/receta', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecetas(response.data);
        } catch (error) {
            console.error('Error al cargar recetas:', error);
            if (error.response && error.response.status === 401) {
                removeToken();
                navigate('/');
            }
        }
    };

    const handleChangeProducto = (e) => {
        setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
    };

    const handleChangeReceta = (e) => {
        setNuevaReceta({ ...nuevaReceta, [e.target.name]: e.target.value });
    };

    const handleChangeIngrediente = (e) => {
        setIngrediente({ ...ingrediente, [e.target.name]: e.target.value });
    };

    const agregarIngrediente = () => {
        setNuevaReceta({
            ...nuevaReceta,
            ingredientes: [...nuevaReceta.ingredientes, ingrediente],
        });
        setIngrediente({ nombre: '', cantidad: '', unidadMedida: '' });
    };

    const agregarProducto = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/bodega', nuevoProducto, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductos([...productos, response.data]);
            setNuevoProducto({ nombre: '', cantidad: '', unidadMedida: '' });
        } catch (error) {
            console.error('Error al agregar producto:', error);
            if (error.response && error.response.status === 401) {
                removeToken();
                navigate('/');
            }
        }
    };

    const agregarReceta = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/receta', nuevaReceta, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecetas([...recetas, response.data]);
            setNuevaReceta({ nombre: '', ingredientes: [] });
        } catch (error) {
            console.error('Error al agregar receta:', error);
            if (error.response && error.response.status === 401) {
                removeToken();
                navigate('/');
            }
        }
    };

    const eliminarProducto = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/bodega/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductos(productos.filter((producto) => producto._id !== id));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            if (error.response && error.response.status === 401) {
                removeToken();
                navigate('/');
            }
        }
    };

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <h1>Panel de Bodega</h1>
                <nav>
    <div className="sidebar-item" onClick={() => setActiveMenu('productos')}>
        <FontAwesomeIcon icon={faBox} /> Productos
    </div>
    <div className="sidebar-item" onClick={() => setActiveMenu('recetas')}>
        <FontAwesomeIcon icon={faClipboard} /> Recetas
    </div>
</nav>

                <button className="logout-button" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                </button>
            </aside>

            <main className="main-content">
                {activeMenu === 'productos' && (
                    <div>
                        <h1>Gestión de Productos</h1>
                        <form className="admin-form">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={nuevoProducto.nombre}
                                onChange={handleChangeProducto}
                            />
                            <input
                                type="number"
                                name="cantidad"
                                placeholder="Cantidad"
                                value={nuevoProducto.cantidad}
                                onChange={handleChangeProducto}
                            />
                            <input
                                type="text"
                                name="unidadMedida"
                                placeholder="Unidad de Medida"
                                value={nuevoProducto.unidadMedida}
                                onChange={handleChangeProducto}
                            />
                            <button type="button" onClick={agregarProducto}>
                                Agregar Producto
                            </button>
                        </form>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Unidad de Medida</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto._id}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>{producto.unidadMedida}</td>
                                        <td>
                                            <button
                                                className="delete-button"
                                                onClick={() => eliminarProducto(producto._id)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeMenu === 'recetas' && (
                    <div>
                        <h1>Gestión de Recetas</h1>
                        <form className="admin-form">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre de la receta"
                                value={nuevaReceta.nombre}
                                onChange={handleChangeReceta}
                            />
                            <div className="admin-form">
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre del ingrediente"
                                    value={ingrediente.nombre}
                                    onChange={handleChangeIngrediente}
                                />
                                <input
                                    type="number"
                                    name="cantidad"
                                    placeholder="Cantidad"
                                    value={ingrediente.cantidad}
                                    onChange={handleChangeIngrediente}
                                />
                                <input
                                    type="text"
                                    name="unidadMedida"
                                    placeholder="Unidad de Medida"
                                    value={ingrediente.unidadMedida}
                                    onChange={handleChangeIngrediente}
                                />
                                <button type="button" onClick={agregarIngrediente}>
                                    Agregar Ingrediente
                                </button>
                            </div>
                            <button type="button" onClick={agregarReceta}>
                                Crear Receta
                            </button>
                        </form>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Ingredientes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recetas.map((receta) => (
                                    <tr key={receta._id}>
                                        <td>{receta.nombre}</td>
                                        <td>
                                            {receta.ingredientes.map((ingrediente, index) => (
                                                <div key={index}>{`${ingrediente.nombre} - ${ingrediente.cantidad} ${ingrediente.unidadMedida}`}</div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <HelpButton />
            </main>
        </div>
        
    );
};

export default Bodega;
