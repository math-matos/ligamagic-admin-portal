<?php

require_once __DIR__ . '/config.php';

exigirAutenticacao();

responder(200, ['nome' => $_SESSION['usuario_nome']]);
