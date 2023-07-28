import app from './src/app.js';

const PORT = 3000;

const handleListening = () =>
  console.log(`${PORT}번 포트로 서버가 열렸습니다.`);

app.listen(PORT, handleListening);
