import Task from '../models/Task.js';
import Board from '../models/Board.js';
import Project from '../models/Project.js';

export const getTasks = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { status, assignedUser, priority, search, dueDate, page = 1, limit = 100 } = req.query;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found' });
    }

    const query = { board: boardId };

    if (status) query.status = status;
    if (assignedUser) query.assignedUser = assignedUser;
    if (priority) query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (dueDate) {
      const startOfDay = new Date(dueDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(dueDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const tasks = await Task.find(query)
      .populate('assignedUser', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, description, status, priority, dueDate, assignedUser } = req.body;

    const board = await Board.findById(boardId).populate('project');
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedUser,
      board: boardId,
      project: board.project._id,
      activityHistory: [{
        action: 'Created task',
        user: req.user._id
      }]
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const originalStatus = task.status;
    
    task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });

    if (req.body.status && req.body.status !== originalStatus) {
      task.activityHistory.push({
        action: `Moved from ${originalStatus} to ${req.body.status}`,
        user: req.user._id
      });
      await task.save();
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    task.activityHistory.push({
      action: 'Added a comment',
      user: req.user._id
    });

    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
