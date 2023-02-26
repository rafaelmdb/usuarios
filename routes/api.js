const express = require ('express');
const { route } = require('express/lib/application');
const router = express.Router();

const usuarioCRUDController = require("../controllers/usuarioCRUDController");

//Define as rotas. A string determina o que vai ser digitado na URL e o segundo método indica o que vai ser executado no backend.
router.get('/usuario', usuarioCRUDController.get);
router.get('/usuario/list', usuarioCRUDController.list);
router.put('/usuario', usuarioCRUDController.update);
router.delete('/usuario', usuarioCRUDController.delete);
router.post('/usuario', usuarioCRUDController.create);
router.post('/signin', usuarioCRUDController.signIn);

module.exports = router;