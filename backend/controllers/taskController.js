import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TASKS (user-specific)
// export const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ userId: req.user._id });

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy } = req.query;

    let filter = { userId: req.user._id };

    // Filtering
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Search by title
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Sorting
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = 1; // ascending
    } else {
      sortOptions.createdAt = -1; // latest first default
    }

    const tasks = await Task.find(filter).sort(sortOptions);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
