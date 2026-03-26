import Project from "../models/Project.js";
import User from "../models/User.js";

export const getProjects = async (req, res, next) => {
  try {
    const { search, sortByDate = 'desc' } = req.query;
    const query = { "members.user": req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOpt = sortByDate === 'asc' ? { createdAt: 1 } : { createdAt: -1 };

    const projects = await Project.find(query)
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort(sortOpt);

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const isMember = project.members.some((member) =>
      member.user._id.equals(req.user._id),
    );
    if (!isMember) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to access this project",
        });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "Admin" }],
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const member = project.members.find((m) => m.user.equals(req.user._id));
    if (!member || member.role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update project" });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const member = project.members.find((m) => m.user.equals(req.user._id));
    if (!member || member.role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete project" });
    }

    await project.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findById(req.params.id);

    console.log("Project found:", project);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const adminMember = project.members.find((m) =>
      m.user.equals(req.user._id),
    );
    if (!adminMember || adminMember.role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });
    }

    if (project.members.some((m) => m.user.equals(userToAdd._id))) {
      return res
        .status(400)
        .json({ success: false, message: "User already a member" });
    }

    project.members.push({ user: userToAdd._id, role: role || "Member" });
    await project.save();

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
