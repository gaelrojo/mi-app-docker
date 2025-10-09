const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// URI corregida - sin espacios ni caracteres especiales
const uri = "mongodb+srv://dockerapp:nIiOE736icN2kZJZ@cluster0.tkgqyqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log("🔍 Verificando URI:", uri); // Para debug

const client = new MongoClient(uri, {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000
});

let isConnected = false;

async function connectDB() {
  try {
    console.log("🔗 Conectando a MongoDB...");
    console.log("📍 URI:", uri.replace(/:[^:]*@/, ':****@')); // Oculta password en logs
    
    await client.connect();
    console.log("✅ Cliente conectado");
    
    await client.db("admin").command({ ping: 1 });
    console.log("🎯 Ping exitoso");
    
    isConnected = true;
    app.locals.db = client.db();
    console.log("🚀 Base de datos lista para usar");
    
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
    isConnected = false;
    
    // Intentar reconectar después de 5 segundos
    setTimeout(connectDB, 5000);
  }
}

// Iniciar conexión
connectDB();

// Rutas
app.get("/", async (req, res) => {
  try {
    if (!isConnected) {
      return res.status(503).json({
        error: "Base de datos no disponible",
        message: "Intentando reconectar..."
      });
    }
    
    const databasesList = await client.db().admin().listDatabases();
    const dbNames = databasesList.databases.map(db => db.name);
    
    res.json({
      message: "¡Conexión exitosa a MongoDB!",
      databases: dbNames,
      total: dbNames.length,
      status: "online"
    });
    
  } catch (err) {
    res.status(500).json({
      error: "Error al consultar bases de datos",
      details: err.message
    });
  }
});

app.get("/status", (req, res) => {
  res.json({
    database: isConnected ? "✅ Conectado" : "❌ Desconectado",
    cluster: "Cluster0",
    user: "dockerapp",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
});