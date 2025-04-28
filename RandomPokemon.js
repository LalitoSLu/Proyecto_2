import React, { useState, useEffect } from 'react';
import { db } from './firebaseClient';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

const RandomPokemon = ({ user }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [pokemonBuscado, setPokemonBuscado] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!user) return;
      const q = query(collection(db, "PokemonFav"), where("user_id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const favs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavoritos(favs);
    };
    cargarFavoritos();
  }, [user]);

  const fetchRandomPokemon = async () => {
    setLoading(true);
    setPokemonBuscado(null);
    const randomId = Math.floor(Math.random() * 898) + 1;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const typeResponse = await fetch(data.types[0].type.url);
      const typeData = await typeResponse.json();
      const weaknesses = typeData.damage_relations.double_damage_from.map(t => t.name).join(', ');

      setPokemon({
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        abilities: data.abilities.map(a => a.ability.name).join(', '),
        types: data.types.map(t => t.type.name).join(', '),
        category: speciesData.genera.find(gen => gen.language.name === "es")?.genus || "Desconocido",
        weaknesses,
        weight: data.weight,
        height: data.height
      });
    } catch (error) {
      console.error('Error al obtener el Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarPokemon = async () => {
    if (!busqueda) return;
    setLoading(true);
    setPokemon(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase()}`);
      const data = await response.json();
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const typeResponse = await fetch(data.types[0].type.url);
      const typeData = await typeResponse.json();
      const weaknesses = typeData.damage_relations.double_damage_from.map(t => t.name).join(', ');

      setPokemonBuscado({
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        abilities: data.abilities.map(a => a.ability.name).join(', '),
        types: data.types.map(t => t.type.name).join(', '),
        category: speciesData.genera.find(gen => gen.language.name === "es")?.genus || "Desconocido",
        weaknesses,
        weight: data.weight,
        height: data.height
      });
    } catch (error) {
      alert("Pokémon no encontrado 😓");
      setPokemonBuscado(null);
    } finally {
      setLoading(false);
    }
  };

  const obtenerSugerencias = async (query) => {
    if (!query) {
      setSugerencias([]);
      return;
    }
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
      const data = await response.json();
      const resultados = data.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
      setSugerencias(resultados.slice(0, 10));
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    obtenerSugerencias(valor);
  };

  const seleccionarSugerencia = (sugerencia) => {
    setBusqueda(sugerencia.name);
    setSugerencias([]);
    buscarPokemon();
  };

  const agregarAFavoritos = async (poke) => {
    if (!poke || !user) return;
    const yaExiste = favoritos.some(f => f.pokemon_name === poke.name);
    if (yaExiste) {
      alert("Este Pokémon ya está en tus favoritos.");
      return;
    }
    const nuevoFavorito = {
      user_id: user.uid,
      pokemon_name: poke.name,
      pokemon_abilities: poke.abilities,
      pokemon_types: poke.types,
      pokemon_category: poke.category,
      pokemon_weaknesses: poke.weaknesses,
      pokemon_image: poke.image
    };
    const docRef = await addDoc(collection(db, "PokemonFav"), nuevoFavorito);
    setFavoritos([...favoritos, { id: docRef.id, ...nuevoFavorito }]);
    setMostrarAnimacion(true);
    setTimeout(() => setMostrarAnimacion(false), 1000);
  };

  const eliminarFavorito = async (nombre) => {
    const confirmar = window.confirm(`¿Eliminar a ${nombre} de favoritos? 😢`);
    if (!confirmar || !user) return;
    const favoritoAEliminar = favoritos.find(f => f.pokemon_name === nombre);
    if (favoritoAEliminar) {
      await deleteDoc(doc(db, "PokemonFav", favoritoAEliminar.id));
      setFavoritos(favoritos.filter(f => f.id !== favoritoAEliminar.id));
    }
  };

  return (
    <div className="pokemon-container">
      {/* Buscador estilizado */}
      <div className="buscador-container">
        <h2 className="titulo-buscador">🔍 Encuentra tu Pokémon favorito</h2>
        <div className="input-grupo">
          <input
            type="text"
            placeholder="Ej: Pikachu, Charmander..."
            value={busqueda}
            onChange={manejarCambioBusqueda}
            className="input-buscador"
          />
          <button onClick={buscarPokemon} disabled={loading} className="boton-buscar">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {sugerencias.length > 0 && (
          <ul className="dropdown-sugerencias">
            {sugerencias.map((sug, index) => (
              <li key={index} onClick={() => seleccionarSugerencia(sug)} className="sugerencia-item">
                {sug.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3>Pokémon Aleatorio</h3>
      {!mostrarFavoritos && (
        <button onClick={fetchRandomPokemon} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Nuevo Pokémon'}
        </button>
      )}

      {(pokemon || pokemonBuscado) && !mostrarFavoritos && (
        <div className="pokemon-card">
          <h4>{(pokemon || pokemonBuscado).name}</h4>
          <img src={(pokemon || pokemonBuscado).image} alt={(pokemon || pokemonBuscado).name} />
          <p><strong>Habilidades:</strong> {(pokemon || pokemonBuscado).abilities}</p>
          <p><strong>Tipo:</strong> {(pokemon || pokemonBuscado).types}</p>
          <p><strong>Categoría:</strong> {(pokemon || pokemonBuscado).category}</p>
          <p><strong>Debilidades:</strong> {(pokemon || pokemonBuscado).weaknesses}</p>
          <div className="favorito-container">
            <button
              className={`heart-button ${favoritos.find(p => p.pokemon_name === (pokemon || pokemonBuscado).name) ? 'activo' : ''}`}
              onClick={() => agregarAFavoritos(pokemon || pokemonBuscado)}
            >
              ❤
            </button>
            {mostrarAnimacion && <div className="corazones-animados">💖💖💖</div>}
          </div>
        </div>
      )}

      {!mostrarFavoritos && (
        <button onClick={() => setMostrarFavoritos(true)} className="ver-favoritos">
          Ver Mis Pokémon Favoritos
        </button>
      )}

      {mostrarFavoritos && (
        <div className="favoritos-lista">
          <h3>Mis Pokémon Favoritos</h3>
          <button onClick={() => setMostrarFavoritos(false)} className="boton-regresar">
            ⬅ Regresar
          </button>

          {favoritos.length === 0 ? (
            <p>No has agregado favoritos aún.</p>
          ) : (
            favoritos.map((p) => (
              <div key={p.id} className="pokemon-card">
                <h4>{p.pokemon_name}</h4>
                <img src={p.pokemon_image} alt={p.pokemon_name} />
                <p><strong>Habilidades:</strong> {p.pokemon_abilities}</p>
                <p><strong>Tipo:</strong> {p.pokemon_types}</p>
                <p><strong>Categoría:</strong> {p.pokemon_category}</p>
                <p><strong>Debilidades:</strong> {p.pokemon_weaknesses}</p>
                <button className="boton-eliminar" onClick={() => eliminarFavorito(p.pokemon_name)}>
                  🗑 Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RandomPokemon;
