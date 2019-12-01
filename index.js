const express = require('express');

const server = express();

server.use(express.json());

var projects = [];

var count = 0;

const consoleRegister = (req, res, next) => {
  count += 1;
  console.log(count);

  next();
}

server.use(consoleRegister);

const checkDataExists = (req, res, next) => {
  if(!req.body && !req.body !== undefined){
    return res.status(401).json({ error: 'empty required fields' });
  }

  next();
}

const checkIsArray = (req, res, next) => {
  if(!Array.isArray(req.body.tasks)){
    return res.status(401).json({ error: 'Inválid data type' });
  }

  next();
}

const checkIdExists = (req, res, next) => {

  const idExists = projects.some((value, index) => {
    if(value.id === req.params.id){
      req.index = index;
      return true;
    }
  });

  if(idExists !== true){
    return res.status(401).json({ error: 'Id not exists in database' });
  }

  console.log('index' + req.index);

  next();
}

server.post('/projects', checkDataExists, checkIsArray, (req, res) => {
  const { id, title, tasks } = req.body;

  const project = {
    id,
    title,
    tasks
  }

  projects.push(project);

  return res.status(200).json({ message: null, success: true });

});

server.get('/projects', (req, res) => {

  return res.json({ projects });

});

server.put('/projects/:id', checkIdExists, (req, res) => {
  
  const { id } = req.params;
  const { title } = req.body;

  var project = projects[req.index];

  project.title = title;

  projects[req.index] = project;

  return res.status(200).json({ projects });

});

server.delete('/projects/:id', checkIdExists, (req, res) => {

  projects.splice(req.index, 1);

  return res.status(200).json({ message: null, success: true });
});

server.listen(3001);