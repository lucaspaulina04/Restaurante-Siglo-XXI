import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Help.css';

const HelpButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            {/* Help Button */}
            <button className="help-button" onClick={toggleModal}>
                <FontAwesomeIcon icon={faQuestionCircle} />
            </button>

            {/* Modal */}
            <div className={`help-modal ${isModalOpen ? 'open' : ''}`}>
                <div className="help-modal-header">
                    <h2>Preguntas Frecuentes</h2>
                    <button className="help-modal-close" onClick={toggleModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="help-modal-content">
                    <p><strong>¿Cómo puedo agregar un producto?</strong><br />Dirígete a la sección 'Productos', completa los campos y haz clic en 'Agregar Producto'.</p>
                    <p><strong>¿Cómo edito o elimino un producto?</strong><br />Utiliza los botones de edición o eliminación en la tabla de productos.</p>
                    <p><strong>¿Cómo puedo crear una receta?</strong><br />En la sección 'Recetas', llena el nombre de la receta y añade los ingredientes requeridos.</p>
                    <p><strong>¿Qué hago si no puedo iniciar sesión?</strong><br />Verifica tus credenciales. Si el problema persiste, contacta al administrador.</p>
                    <p><strong>¿Cómo cierro sesión?</strong><br />Haz clic en el botón 'Cerrar Sesión' en la barra lateral para salir de la aplicación.</p>
                    <p><strong>¿Qué hago si no veo los productos que busco?</strong><br />Asegúrate de que tu conexión a internet está activa y vuelve a cargar la página.</p>
                    <p><strong>¿Cómo actualizo el estado de un pedido?</strong><br />En el tablero de órdenes, selecciona el pedido y utiliza los botones de acción correspondientes para actualizar su estado.</p>
                    <p><strong>¿Qué hago si la aplicación no responde?</strong><br />Intenta cerrar y volver a abrir la aplicación. Si el problema persiste, contacta al soporte técnico.</p>
                    <p><strong>¿Cómo puedo buscar una receta específica?</strong><br />Ve a la sección de recetas</p>
                    <p><strong>¿Cómo cambio mi contraseña?</strong><br />Debes contactarte con el administrador del recinto.</p>
                </div>

            </div>

            {/* Modal Backdrop */}
            <div
                className={`modal-backdrop ${isModalOpen ? 'open' : ''}`}
                onClick={toggleModal}
            ></div>
        </>
    );
};

export default HelpButton;
