import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetchValue, setRefetchValue] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [editProject, setEditProject] = useState({ id: '', title: '' });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/projects');
      const sortedData = res.data.projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProjects(sortedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refetchValue]);

  const refetch = () => {
    setRefetchValue(!refetchValue);
  };

  const updateProject = async (id, title) => {
    try {
      const response = await axiosInstance.put(`/project/update/${id}`, { title });
      const result = response.data
      setEditProject({ id: '', title: '' });
      setIsEditModalOpen(false);
      toast.success(result.message);
      refetch();
    } catch (error) {
        toast.error(error.response.data.message);
    }
  };

  const handleCreateProject = async () => {
    try {
      const name = localStorage.getItem("user");
      await axiosInstance.post('/creatProject', { newProject, name: name });
      setIsCreateModalOpen(false);
      setNewProject({ title: '', description: '' });
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
      setIsCreateModalOpen(false);
      refetch();
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (project) => {
    setEditProject({ id: project._id, title: project.title });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleLogout = async ()=>{
    await axiosInstance.post('/logout');
    localStorage.removeItem('user')
    Cookies.remove('jwt');
    location.reload()
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <nav className="w-full bg-blue-600 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Project Manager</div>
          <div className="flex space-x-4">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 font-semibold text-white bg-green-500 border border-green-500 rounded hover:bg-green-800 hover:text-white hover:border-transparent"
            >
              Create a new Project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-semibold text-white bg-red-600 border border-red-500 rounded hover:bg-red-800 hover:text-white hover:border-transparent"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4 flex-grow">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th
                  scope="col"
                  className="w-1/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Sl.No
                </th>
                <th
                  scope="col"
                  className="w-3/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="w-3/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="w-3/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="w-3/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Options
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={project._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/projects/${project._id}`}>{project.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(project.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(project)}
                        className="px-4 py-2 font-semibold text-white bg-red-500 border border-red-500 rounded hover:bg-red-800 hover:text-white hover:border-transparent"
                      >
                        Edit Title
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-900"
                  >
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateProject();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  required
                  className="mt-1 p-2 w-full border rounded"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 border border-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Project Title</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProject(editProject.id, editProject.title);
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editProject.title}
                  onChange={(e) =>
                    setEditProject({ ...editProject, title: e.target.value })
                  }
                  required
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 border border-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
