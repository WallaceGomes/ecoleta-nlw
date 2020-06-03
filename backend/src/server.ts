import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  console.log('Hello world');

  res.json(['Wallace', 'loucura', 'mais loucura']);
});

app.listen(3333);
