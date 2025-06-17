# Instructions d'installation des améliorations techniques

Ce document contient les instructions pour installer et configurer correctement toutes les améliorations techniques demandées pour votre projet Angular/Express.

## 1. Dépendances Frontend (Angular)

En raison de problèmes de compatibilité avec la version actuelle d'Angular (v19.1.x), certaines dépendances doivent être installées manuellement avec des versions spécifiques :

```bash
# Service Worker pour PWA
ng add @angular/pwa

# NgRx pour la gestion d'état
npm install @ngrx/store@19.0.0 @ngrx/effects@19.0.0 @ngrx/entity@19.0.0 @ngrx/store-devtools@19.0.0

# Autres dépendances frontend
npm install class-transformer class-validator
npm install pouchdb pouchdb-adapter-http @types/pouchdb
npm install socket.io-client @types/socket.io-client
```

## 2. Dépendances Backend (Express.js)

```bash
cd ../backend

# Validation et authentification
npm install joi passport passport-jwt passport-local

# Monitoring et cache
npm install redis express-prom-bundle prom-client

# Communication temps réel
npm install socket.io

# Types TypeScript
npm install -D typescript @types/express @types/mongoose @types/node @types/passport @types/passport-jwt @types/passport-local @types/redis
```

## 3. Configuration du TypeScript pour le backend

Créez un fichier `tsconfig.json` à la racine du dossier backend :

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## 4. Activation des fonctionnalités désactivées temporairement

1. **Service Worker (PWA)**
   - Dans `app.config.ts`, décommentez l'import du service worker et sa configuration.

2. **NgRx**
   - Vérifiez que les fichiers dans `src/app/store` sont correctement configurés et utilisent les bonnes versions des dépendances.

3. **Intercepteurs HTTP**
   - Assurez-vous que les intercepteurs HTTP pour l'authentification et la gestion des erreurs sont correctement configurés.

## 5. MongoDB Change Streams

Pour configurer MongoDB Change Streams pour les mises à jour en temps réel, ajoutez le code suivant dans votre fichier `server.js` backend :

```javascript
// Configuration Socket.io
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Configuration du Change Stream MongoDB
const configureChangeStreams = () => {
  const db = mongoose.connection.db;
  
  // Surveiller les collections pertinentes
  const collections = ['users', 'documents', 'messages']; // Remplacez par vos collections
  
  collections.forEach(collectionName => {
    const collection = db.collection(collectionName);
    const changeStream = collection.watch();
    
    changeStream.on('change', change => {
      console.log(`Changement détecté dans la collection ${collectionName}:`, change);
      
      // Émettre l'événement aux clients connectés
      io.emit(`${collectionName}-changed`, {
        operationType: change.operationType,
        documentId: change.documentKey?._id,
        data: change.fullDocument
      });
    });
  });
};

mongoose.connection.once('open', () => {
  console.log('MongoDB connected, setting up change streams');
  configureChangeStreams();
});
```

## 6. Redis pour le cache distribué

Ajoutez le code suivant dans un fichier `config/redis.js` de votre backend :

```javascript
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Promisify Redis commands
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    const key = `api:${req.originalUrl}`;
    
    getAsync(key).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response
        res.json(JSON.parse(cachedResponse));
      } else {
        // Override res.json to store response in cache
        const originalJson = res.json;
        res.json = function(data) {
          const response = data;
          setAsync(key, JSON.stringify(response))
            .then(() => expireAsync(key, duration))
            .catch(console.error);
          
          return originalJson.call(this, data);
        };
        next();
      }
    }).catch((err) => {
      console.error('Redis cache error:', err);
      next();
    });
  };
};

module.exports = {
  client,
  getAsync,
  setAsync,
  delAsync,
  expireAsync,
  cache
};
```

## Notes importantes

1. Assurez-vous que les versions des dépendances sont compatibles avec vos versions actuelles d'Angular et Node.js.
2. Pour les environnements de production, configurez correctement les variables d'environnement pour Redis, MongoDB, etc.
3. N'oubliez pas d'activer CORS pour les communications Socket.io entre le frontend et le backend.
4. Pour une implémentation complète de PouchDB pour la synchronisation offline, référez-vous à la documentation officielle.
