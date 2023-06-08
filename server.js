const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    let newNote = req.body;
    newNote.id = notes.length.toString();
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), err => {
      if (err) throw err;
      res.json(newNote);
      console.log("Note saved!")
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), err => {
      if (err) throw err;
      res.json({ ok: true });
      console.log("Note deleted!")
    });
  });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
