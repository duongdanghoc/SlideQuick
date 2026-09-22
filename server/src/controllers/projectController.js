// src/controllers/projectController.js
const projectService = require('../services/projectService');

/**
 * Get all projects for authenticated user
 */
async function getAllProjects(req, res) {
  try {
    const userId = req.user && req.user.id;
    const deletedOnly = req.query.deleted === 'true';
    const projects = projectService.getAllProjects(userId, deletedOnly);
    res.json(projects);
  } catch (error) {
    console.error('Lỗi lấy danh sách dự án:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách dự án' });
  }
}

/**
 * Get project by ID
 */
async function getProjectById(req, res) {
  try {
    const userId = req.user && req.user.id;
    const project = projectService.getProjectById(req.params.id, userId);

    if (!project) {
      return res.status(404).json({
        error: 'Không tìm thấy dự án hoặc không có quyền truy cập',
      });
    }

    res.json(project);
  } catch (error) {
    console.error('Lỗi lấy chi tiết dự án:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin dự án' });
  }
}

/**
 * Create new project
 */
async function createProject(req, res) {
  try {
    const userId = req.user && req.user.id;
    const project = projectService.createProject(req.body, userId);
    res.status(201).json(project);
  } catch (error) {
    console.error('Lỗi tạo dự án:', error);
    res.status(500).json({ error: 'Không thể tạo dự án' });
  }
}

/**
 * Update existing project
 */
async function updateProject(req, res) {
  try {
    const userId = req.user && req.user.id;
    const project = projectService.updateProject(req.body, userId);

    if (!project) {
      return res.status(404).json({
        error: 'Không tìm thấy dự án hoặc không có quyền truy cập',
      });
    }

    res.json(project);
  } catch (error) {
    console.error('Lỗi cập nhật dự án:', error);
    res.status(500).json({ error: 'Không thể cập nhật dự án' });
  }
}

/**
 * Delete project
 */
async function deleteProject(req, res) {
  try {
    const userId = req.user && req.user.id;
    const ok = projectService.deleteProject(req.params.id, userId);

    if (!ok) {
      return res.status(404).json({
        error: 'Không tìm thấy dự án hoặc không có quyền truy cập',
      });
    }

    res.json({ message: 'Dự án đã được chuyển vào thùng rác' });
  } catch (error) {
    console.error('Lỗi xóa dự án:', error);
    res.status(500).json({ error: 'Không thể xóa dự án' });
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  restoreProject,
  getProjectForGuest,
  updateShareMode,
  trackProjectAccess,
  getSharedProjects,
};

/**
 * Restore deleted project
 */
async function restoreProject(req, res) {
  try {
    const userId = req.user && req.user.id;
    const ok = projectService.restoreProject(req.params.id, userId);

    if (!ok) {
      return res.status(404).json({
        error: 'Không tìm thấy dự án hoặc không có quyền truy cập',
      });
    }

    res.json({ message: 'Dự án đã được khôi phục' });
  } catch (error) {
    console.error('Lỗi khôi phục dự án:', error);
    res.status(500).json({ error: 'Không thể khôi phục dự án' });
  }
}

/**
 * Get project for guest access (no auth required)
 */
async function getProjectForGuest(req, res) {
  try {
    const project = projectService.getProjectForGuest(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error getting project for guest:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
}

/**
 * Update share mode for a project
 */
async function updateShareMode(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { shareMode } = req.body;

    if (!shareMode || !['private', 'view', 'edit'].includes(shareMode)) {
      return res.status(400).json({ error: 'Invalid share mode. Must be private, view, or edit.' });
    }

    const updated = projectService.updateShareMode(req.params.id, userId, shareMode);

    if (!updated) {
      return res.status(404).json({ error: 'Project not found or not authorized' });
    }

    res.json({ success: true, shareMode });
  } catch (error) {
    console.error('Error updating share mode:', error);
    res.status(500).json({ error: 'Failed to update share mode' });
  }
}

/**
 * Track user access to shared project
 */
async function trackProjectAccess(req, res) {
  try {
    const userId = req.user && req.user.id;
    // projectService is synchronous, but good practice to await if it changes
    await projectService.trackProjectAccess(userId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking project access:', error);
    res.status(500).json({ error: 'Failed to track access' });
  }
}

/**
 * Get projects shared with me
 */
async function getSharedProjects(req, res) {
  try {
    const userId = req.user && req.user.id;
    const projects = projectService.getSharedProjects(userId);
    res.json(projects);
  } catch (error) {
    console.error('Error getting shared projects:', error);
    res.status(500).json({ error: 'Failed to get shared projects' });
  }
}
