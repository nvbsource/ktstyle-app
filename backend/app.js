const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const path = require('path')

const clientRoutes = require('./routes/client')
const adminRoutes = require('./routes/admin')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/models', express.static(path.join(__dirname, 'public', 'models')))
app.use('/uploads', express.static('uploads'))

app.use("/api/client", clientRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5005, () => {
  console.log('Server is running on port 5005')
})
