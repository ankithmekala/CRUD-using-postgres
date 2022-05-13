const express = require('express');
const app  = express();
const pool = require('./db');

app.use(express.json()) // -> req.body 


//ROUTES//

//get all student
app.get('/student', async (req, res) => {
    try {
        const allStudent = await pool.query('SELECT * FROM student');

        res.json(allStudent.rows);
    } catch (err) {
    console.error(err.message);
    }
});

//get a student by id

app.get('/student/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const student = await pool.query('SELECT * FROM student WHERE student_id = $1', [id]);
        res.json(student.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//create a student

app.post("/student", async (req, res) => {
    try {
        const { first_name, last_name, email, city} = req.body;
        const newStudent = await pool.query(
            "INSERT INTO student (first_name, last_name, email, city) VALUES ($1, $2, $3, $4) RETURNING *",
            [first_name, last_name, email, city]
            );
        res.json(newStudent);
    } catch (err) {
        console.log(err.message);
    }
});

//update a student

app.put("/student/:id", async (req, res) => {
    try {
    const { id } = req.params;
    const { first_name, last_name, email, city} = req.body;

    const updateStudent = await pool.query(
        "UPDATE student SET first_name = $1, last_name = $2, email = $3, city = $4 WHERE student_id = $5",
        [first_name, last_name, email, city, id]
    );
    res.json("Updated Successfully");
    } catch (err) {
        console.log(err.message);
    }
});

//delete a student

app.delete("/student/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteStudent = await pool.query("DELETE FROM student WHERE student_id = $1", [id]);
        res.json("Deleted Successfully");
    }    catch (err) {
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});