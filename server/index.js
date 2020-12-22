const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// save images to images directory
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// global variables
const PORT = process.env.PORT || 5000;
const DB_URL = 'mongodb://localhost:27017/ecommerce';
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true });

app.use(cors({
    origin: ['*'],
    exposedHeaders: ['auth-token']
}));

// routes
const userRoutes = require('./router/userRoute');
const itemRoutes = require('./router/itemRoute');
const cartRoutes = require('./router/cartRoute');
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/carts', cartRoutes);

const server = app.listen(PORT, (_) => {
    console.log(`app listening on PORT ${PORT}`);
    console.log(`Local:  http://localhost:${PORT}`);
});
