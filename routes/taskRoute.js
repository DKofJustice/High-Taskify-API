const express = require('express')
const taskModel = require('../models/task');
const userModel = require('../models/user');

const router = express.Router();

router.post("/add_task", async (req, res) => {
    const { userId, title, notes, date, time, flag } = req.body;

    try {
        // Create a new task document
        const newTask = new taskModel({
            title,
            notes,
            date,
            time,
            flag,
            user: userId
        });

        // Save the new task to the database
        await newTask.save();

        await userModel.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });

        // Send a success response
        res.status(201).json({ message: "Task added successfully", task: newTask });
    } catch (error) {
        // Handle errors
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// Fetch all tasks
router.get("/get_tasks/:userId", async (req, res) => {
    try {
        const userId = req.params.userId; // Get the user ID from the request

        // Find the user by ID and populate the tasks array
        const user = await userModel.findById(userId).populate('tasks');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract tasks from the user object
        const tasks = user.tasks;

        // Send the tasks as response
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// Fetch all tasks set for today
router.get("/get_tasks_today/:userId", async (req, res) => {
    try {
        const userId = req.params.userId; // Get the user ID from the request

        // Find the user by ID and populate the tasks array
        const user = await userModel.findById(userId).populate('tasks');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create today's date string and format it
        const date = new Date()
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth() + 1;
        let year = date.getFullYear()

        let fullDate = `${year}-${month}-${day}`;

        // Extract tasks from the user object
        const tasks = user.tasks;

        function isTodayTask(task) {
            const updatedDateString = task.date?.toISOString().replace("T00:00:00.000Z", "");
            return updatedDateString === fullDate;
        };

        const todayTasks = tasks.filter(isTodayTask)

        // Send the tasks as response
        res.status(200).json(todayTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// Fetch all tasks marked as important/flagged
router.get("/get_tasks_flagged/:userId", async (req, res) => {
    try {
        const userId = req.params.userId; // Get the user ID from the request

        // Find the user by ID and populate the tasks array
        const user = await userModel.findById(userId).populate('tasks');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract tasks from the user object
        const tasks = user.tasks;

        const flaggedTasks = tasks.filter(task => task.flag === true)

        // Send the tasks as response
        res.status(200).json(flaggedTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// Fetch all completed tasks
router.get("/get_tasks_completed/:userId", async (req, res) => {
    try {
        const userId = req.params.userId; // Get the user ID from the request

        // Find the user by ID and populate the tasks array
        const user = await userModel.findById(userId).populate('tasks');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract tasks from the user object
        const tasks = user.tasks;

        const completedTasks = tasks.filter(task => task.isCompleted === true)

        // Send the tasks as response
        res.status(200).json(completedTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/edit_task", async (req, res) => {
    const { taskId, userId, title, notes, date, time, flag } = req.body;

    try {
        // Edit a task document
        const editedTask = await taskModel.findByIdAndUpdate({ _id: taskId },{
            title,
            notes,
            date,
            time,
            flag,
        }, {
            new: true
        });

        // Send a success response
        res.status(201).json({ message: "Task edited successfully", task: editedTask });
    } catch (error) {
        // Handle errors
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.delete("/delete_task/:id", async (req, res) => {
    const { id } = req.body;

    try {
        // Create a new task document
        const deletedTask = await taskModel.findOneAndDelete({ id });

        if(!deletedTask) {
            res.status(404).json({message: 'Reminder was not found'})
        }

        // Send a success response
        res.status(201).json({ message: "Reminder was deleted" });
    } catch (error) {
        // Handle errors
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/complete_task/:id", async (req, res) => {
    const { isCompleted } = req.body;
    const { id } = req.params;

    try {
        const editedTask = await taskModel.findByIdAndUpdate({ _id: id },{
            isCompleted,
        }, {
            new: true
        });

        // Send a success response
        res.status(201).json({ message: "Task completed successfully", task: editedTask });
    } catch(err) {
        res.status(404).json({ message: 'Could not complete task. Please try again' })
    }
})

module.exports = router;