const express = require("express");
const app = express();
const { getAllShows, getShowById, validateShow, addShow  } = require("./controllers");

app.use(express.json());

// Endpoint to get all shows
app.get("/shows", async (req, res) => {
 try{ 
 const shows = await getAllShows();
 if(shows.length === 0){
  return res.status(404).json({ error: "Shows not found." });
 }
 return res.status(200).json({ shows });
 } catch(error){
   res.status(500).json({ error: "Internal Server Error." });
 }
});

// Endpoint to get show by Id
app.get("/shows/:id", async (req, res) => {
  try {
    const show = await getShowById(parseInt(req.params.id));
    if (!show) {
      return res.status(404).json({ error: "No Show found with this Id" });
    }
    return res.status(200).json({ show });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error." });
  }
});

// Endpoint to add a new Show
app.post("/shows", async (req, res) => {
 let error = validateShow(req.body);
 if(error) return res.status(400).send(error);

 let show = {...req.body};
 let addedShow = await addShow(show);
 res.status(201).json(addedShow);
});

module.exports = { app };