// index.js

const express = require('express');
const fs = require('fs');
const PriorityQueue = require('./priorityQueue');
const Stack = require('./stack');

const app = express();
app.use(express.json());

const complaintsQueue = new PriorityQueue();
const resolvedComplaintsStack = new Stack();

let complaintIdCounter = 1;

// POST /complaints - Add new complaint
app.post('/complaints', (req, res) => {
    const { type, location, priority } = req.body;
    const complaint = { id: complaintIdCounter++, type, location, priority };
    complaintsQueue.enqueue(complaint);
    res.status(201).send({ message: "Complaint registered", complaint });
});

// GET /complaints - Retrieve complaints in priority order
app.get('/complaints', (req, res) => {
    res.status(200).send(complaintsQueue.getQueue());
});

// PUT /complaints/:id/resolve - Resolve a complaint
app.put('/complaints/:id/resolve', (req, res) => {
    const id = parseInt(req.params.id);

    // Find the index of the complaint with the specified ID
    const complaintIndex = complaintsQueue.getQueue().findIndex(c => c.id === id);

    if (complaintIndex !== -1) {
        // Retrieve and remove the complaint from the queue
        const [complaint] = complaintsQueue.getQueue().splice(complaintIndex, 1);

        // Push to stack for historical tracking
        resolvedComplaintsStack.push(complaint);

        // Log resolved complaint
        logResolvedComplaint(complaint);

        res.status(200).send({ message: "Complaint resolved", complaint });
    } else {
        res.status(404).send({ message: "Complaint not found" });
    }
});


// GET /complaints/history - Retrieve historical data
app.get('/complaints/history', (req, res) => {
    res.status(200).send(resolvedComplaintsStack.getStack());
});

// Function to log resolved complaints into a CSV file
function logResolvedComplaint(complaint) {
    const log = `${complaint.id},${complaint.type},${complaint.location},${complaint.priority},${new Date().toISOString()}\n`;
    fs.appendFileSync('resolved_complaints.csv', log, 'utf8');
}

app.listen(3000, () => {
    console.log("Server running on port 3000");
});




// http://localhost:3000/complaints/:id/resolve
