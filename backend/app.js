const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const uploadRoute = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productContentsRoutes = require('./routes/productContentsRoutes');


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/contents', productContentsRoutes);
app.use('/api', uploadRoute);

app.listen(5005, () => {
  console.log('Server is running on port 5005');
});
