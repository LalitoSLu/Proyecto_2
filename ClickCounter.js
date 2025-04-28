// src/Componentes/ClickCounter.js
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebaseClient';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import './ClickCounter.css';

function ClickCounter({ user }) {
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [records, setRecords] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [showRecords, setShowRecords] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const guardarRecordSiAplica = useCallback(async () => {
    if (!user || clickCount === 0) return;

    try {
      await addDoc(collection(db, 'RecorsC'), {
        user_id: user.uid,
        clicks: clickCount,
        created_at: new Date()
      });
      console.log("📥 Récord guardado");
    } catch (error) {
      console.error("❌ Error guardando récord:", error);
    }
  }, [user, clickCount]);

  const traerRecordsDelUsuario = useCallback(async () => {
    if (!user) {
      console.log("⚠️ Usuario no autenticado.");
      return;
    }

    try {
      console.log("📤 Cargando récords para:", user.uid);
      const q = query(
        collection(db, 'RecorsC'),
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());

      console.log("✅ Récords cargados:", data);

      setRecords(data);

      if (data.length > 0) {
        const max = Math.max(...data.map(r => r.clicks));
        setHighScore(max);
      }
    } catch (error) {
      console.error("❌ Error cargando los récords:", error);
    }
  }, [user]);

  useEffect(() => {
    if (timer === 0 && clickCount > 0) {
      guardarRecordSiAplica().then(() => {
        traerRecordsDelUsuario();
      });
    }
  }, [timer, guardarRecordSiAplica, traerRecordsDelUsuario, clickCount]);

  const handleClick = () => {
    if (isActive) {
      setClickCount(prev => prev + 1);
      setClickEffect(true);
      setTimeout(() => setClickEffect(false), 200);
    }
  };

  const startGame = () => {
    setClickCount(0);
    setTimer(15);
    setIsActive(true);
    setHasStarted(true);
    setShowRecords(false);
  };

  return (
    <div className="click-counter-container">
      <h1>Contador de Clicks</h1>
      <p>⏱ Tiempo restante: {timer}s</p>
      <p>👆 Clicks: {clickCount}</p>
      <p>🏆 Récord personal: {highScore} clicks</p>

      {!hasStarted ? (
        <button className="start-button" onClick={startGame}>
          🚀 Comenzar
        </button>
      ) : (
        <button
          onClick={handleClick}
          disabled={!isActive}
          className={`big-click-button ${clickEffect ? 'button-clicked' : ''}`}
        >
          ¡CLICK!
        </button>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={startGame}>🔄 Reiniciar</button>
        <button
          onClick={() => {
            console.log("📊 Botón Ver Récords presionado");
            if (!showRecords) {
              traerRecordsDelUsuario();
            }
            setShowRecords(prev => !prev);
          }}
        >
          {showRecords ? 'Ocultar récords' : '📊 Ver récords'}
        </button>
      </div>

      {showRecords && (
        <ul style={{ marginTop: '1rem' }}>
          {records.length === 0 ? (
            <li>No hay récords guardados.</li>
          ) : (
            records.map((r, i) => (
              <li key={i}>Intento {i + 1}: {r.clicks} clicks</li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default ClickCounter;
