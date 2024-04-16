import express from 'express';
import {PORT} from './environment.js'
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
    console.log(request);
    return response.status(234).send("The API status is UP");
  });

app.listen(PORT, () => {
  console.log(
    `App is listening to port: ${PORT} at http://localhost:${PORT}`
  );
});