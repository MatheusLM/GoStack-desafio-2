const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = { 
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push( repository )
  response.json( repository )
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  if( !isUuid(id) ){
    return response.status(400).json({ error: "Invalid ID" })
  }

  const index = repositories.findIndex( repository => repository.id === id )
  repositories[index].title = title
  repositories[index].url = url
  repositories[index].techs = techs
  response.json( repositories[index] )
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  if( !isUuid(id) ){
    return response.status(400).json({ error: "Invalid ID" })
  }
  const index = repositories.findIndex( repository => repository.id === id )
  repositories.splice(index, 1)
  return response.status(204).json(repositories)
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  if( !isUuid(id) ){
    return response.status(400).json({ error: "Invalid ID" })
  }
  const index = repositories.findIndex( repository => repository.id === id )
  repositories[index].likes += 1
  return response.json(repositories[index])
});

module.exports = app;
