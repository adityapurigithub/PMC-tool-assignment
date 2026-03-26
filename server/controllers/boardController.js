import Board from '../models/Board.js';
import Project from '../models/Project.js';

export const getBoards = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isMember = project.members.some(m => m.user.equals(req.user._id));
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const boards = await Board.find({ project: req.params.projectId });
    res.json({ success: true, count: boards.length, data: boards });
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const member = project.members.find(m => m.user.equals(req.user._id));
    if (!member || member.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized, must be Admin' });
    }

    const board = await Board.create({
      project: req.params.projectId,
      name: req.body.name || 'New Board'
    });

    res.status(201).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
};
