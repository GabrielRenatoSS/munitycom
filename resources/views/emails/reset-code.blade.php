<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Recuperação de Senha</title>
  <style>
    body {
      margin: 0; padding: 0;
      background: #f4f0ff;
      font-family: Arial, sans-serif;
      color: #3a1a7a;
    }
    .wrapper {
      max-width: 480px;
      margin: 40px auto;
      background: #ddd3f3;
      border-radius: 24px;
      padding: 40px 48px;
      text-align: center;
    }
    .logo {
      width: 160px;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 2rem;
      color: #8c52ff;
      margin: 0 0 8px;
      line-height: 1.1;
    }
    p {
      font-size: 1rem;
      color: #6425d8;
      margin: 0 0 24px;
    }
    .code-box {
      display: inline-block;
      background: #c3a5ff;
      border-radius: 50px;
      padding: 14px 40px;
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: 0.4rem;
      color: #ffffff;
      margin-bottom: 24px;
    }
    .expiry {
      font-size: 0.85rem;
      color: #6425d8;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <img src="{{ asset('images/logo.png') }}" alt="MUN.com" class="logo" />
    <h1>recupere<br>sua senha</h1>
    <p>Use o código abaixo para redefinir sua senha.<br>Ele expira em <strong>15 minutos</strong>.</p>
    <div class="code-box">{{ $code }}</div>
    <p class="expiry">Se você não solicitou a recuperação, ignore este e-mail.</p>
  </div>
</body>
</html>
