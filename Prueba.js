import { db } from './Componentes/firebaseClient'
import { doc, setDoc } from 'firebase/firestore'

import { supabase } from './Componentes/supabaseClient'

const probarConexiones = async () => {
  // Firebase: crear documento
  await setDoc(doc(db, "testFirebase", "prueba1"), {
    mensaje: "Hola desde Firebase"
  })

  // Supabase: insertar en tabla "test"
  const { error } = await supabase
    .from("test")
    .insert([{ mensaje: "Hola desde Supabase" }])

  if (error) {
    console.error("Error en Supabase:", error)
  } else {
    console.log("Datos guardados en ambos")
  }
}
