import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { auth } from './firebaseClient';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import './Login.css'; // Asegúrate de tener estilos personalizados

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSupabaseSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError("Completa todos los campos.");

    if (isRegister) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        setError("El usuario ya existe.");
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ username, password }]);

        if (insertError) setError("Error al registrar el usuario.");
        else {
          alert("Registro exitoso. Ahora inicia sesión.");
          setIsRegister(false);
          setUsername('');
          setPassword('');
        }
      }
    } else {
      const { data: user } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (user) onLogin(user);
      else setError("Usuario o contraseña incorrecta.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (error) {
      alert("Error con Google");
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (error) {
      alert("Error con GitHub");
    }
  };

  return (
    
    <div className="login-page">
      <div className="login-container">
        <h2>Bienvenido</h2>
        <p className="login-subtext">Inicia sesión con:</p>
        
        <div className="social-login-buttons">
          <button onClick={handleGoogleLogin} className="icon-button google">
            <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
          </button>
          <button onClick={handleGithubLogin} className="icon-button github">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" />
          </button>
        </div>

        {/* Formulario Supabase opcional */}
        <div className="manual-login">
          <form onSubmit={handleSupabaseSubmit} className="login-form">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              {isRegister ? "Registrarse" : "Entrar"}
            </button>
          </form>
          <p className="toggle-text">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{' '}
            <span onClick={() => { setIsRegister(!isRegister); setError(""); }} className="login-toggle">
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </span>
          </p>
        </div>
      </div>
    </div>
    
  );
}

export default Login;
