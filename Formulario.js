import React, { useState } from 'react';
import './ClickCounter.css'; // Importamos los estilos

function Formulario() {
  // Estado para almacenar el nombre y apellido
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  // Manejar el cambio en los campos de input
  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleApellidoChange = (event) => {
    setApellido(event.target.value);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Evitar la recarga de la página al enviar
    alert(`Formulario enviado:\nNombre: ${nombre}\nApellido: ${apellido}`);
  };

  return (
    <div className="click-counter-container">
      <h1>Ejercicio 2 - Formulario</h1>

      <div id="Estilos-form">
        <div id="Nombre-style">
          <label htmlFor="nombre">Nombre: </label>
          <input
            type="text"
            id="nombre"
            placeholder="Introduce tu nombre"
            value={nombre}
            onChange={handleNombreChange}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="apellido">Apellido: </label>
            <input
              type="text"
              id="apellido"
              placeholder="Introduce tu apellido"
              value={apellido}
              onChange={handleApellidoChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Formulario;
