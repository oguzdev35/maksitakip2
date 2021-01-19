const express = require('express');

const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.send('Maksitakip WEB API Services');
    })

// Swagger Documentation - Open API 3
const swaggerUI = require('swagger-ui-express');

router.use('/api-docs', swaggerUI.serve);
router.get('/api-docs', swaggerUI.setup(require('../../swagger.json')));

module.exports = router;