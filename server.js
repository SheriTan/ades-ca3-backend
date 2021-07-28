//----------------------------------------------
// imports
//----------------------------------------------
const app = require('./controller/app');

//----------------------------------------------
// configuration
//----------------------------------------------

const port = process.env.PORT||5000;

//----------------------------------------------
// main
//----------------------------------------------

// start the server and start listening for incoming requests
app.listen(port, () => {
    console.log(`Server listening on Port ${port}`);
});