import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import Cookies from 'js-cookie';

const MyTodos = () => {
  const { id } = useParams()
  const [project, setProject] = useState({})
  const [todosData, setTodosData] = useState([]);
  const [newTodo, setNewTodo] = useState({ description: '' });
  const [editTodo, setEditTodo] = useState(null);
  const [statusValues, setStatusValues] = useState({});
  const [showDropdowns, setShowDropdowns] = useState({});
  const [refetchValue, setRefetchValue] = useState(false);
  
  const fetchTodos = async (id) => {
    try {
      const response = await axiosInstance.get(`/getTodos?project=${id}`);
      const sortedData = response.data.todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTodosData(sortedData);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProject = async (id) => {
    
    try {
      const response = await axiosInstance.get(`/findProject/${id}`);
      const {project} = response.data;
      setProject(project);
    } catch (error) {
      console.error(error);
    }
  };
  const exportGist = async () => {
    
    try {
      const response = await axiosInstance.post(`/projects/${id}/export`);
      const result = response.data;
      toast.success(result.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchTodos(id);
    fetchProject(id)
  }, [refetchValue]);

  const refetch = () => {
    setRefetchValue(!refetchValue);
  };



  const toggleDropdown = (index) => {
    setShowDropdowns((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addTodo = async (id) => {
    try {
      const res = await axiosInstance.post('/addTodos', { ...newTodo, id });
      const result = res.data
      setNewTodo({ description: '' });
      toast.success(result.message);
      refetch()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateTodo = async () => {
    try {
      const res = await axiosInstance.put(`/todos/update/${editTodo._id}`, editTodo);
      const result = res.data
      setEditTodo(null);
      toast.success(result.message);
      refetch()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const completeTodo = async (id, index) => {
    setStatusValues((prev) => ({ ...prev, [index]: "Complete" }));
    try {
      const res = await axiosInstance.put(`/todos/complete/${id}`);
      const result = res.data;
      toast.success(result.message);
      refetch()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteTodo = async (id, index) => {
    setStatusValues((prev) => ({ ...prev, [index]: "Delete" }));
    try {
      const res = await axiosInstance.delete(`/todos/delete/${id}`);
      const result = res.data;
      toast.success(result.message);
      refetch()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

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
              onClick={handleLogout}
              className="px-4 py-2 font-semibold text-white bg-red-600 border border-red-500 rounded hover:bg-red-800 hover:text-white hover:border-transparent"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>

       
        <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto mb-6">
          <h2 className="text-xl font-bold mb-4">{editTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editTodo ? updateTodo() : addTodo(id);
            }}
          >
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={editTodo ? editTodo.description : newTodo.description}
                onChange={(e) =>
                  editTodo
                    ? setEditTodo({ ...editTodo, description: e.target.value })
                    : setNewTodo({ ...newTodo, description: e.target.value })
                }
                required
                className="mt-1 p-2 w-full border rounded"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700"
              >
                {editTodo ? 'Update Todo' : 'Add Todo'}
              </button>
            </div>
          </form>
        </div>

        {/* Todo Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-slate-400">
              <tr>
                <th scope="col" className=" w-1/12 px-6 py-3">
                  Sl.No
                </th>
                <th scope="col" className="w-4/12 px-6 py-3">
                  Description
                </th>
                <th scope="col" className="w-3/12 px-6 py-3">
                  Date
                </th>
                <th scope="col" className="w-3/12 px-6 py-3">
                  Status
                </th>
                <th scope="col" className="w-3/12 px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {todosData && todosData.length ? (
                todosData.map((todo, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-[#e8e8ff]">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{todo.description}</td>
                    <td className="px-6 py-4">{new Date(todo.createdAt).toISOString().split('T')[0]}</td>
                    <td
                      className={`px-6 py-4 ${
                        todo.status === "Complete" ? "text-green-500" : "text-yellow-600"
                      }`}
                    >
                      {todo.status}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex relative">
                        <button
                          className={`${showDropdowns[index] ? "text-blue-500" : "text-gray-500"} mr-4`}
                          onClick={() => toggleDropdown(index)}
                        >
                          Select
                        </button>
                        {showDropdowns[index] && (
                          <div className="absolute bg-white border rounded shadow-lg mt-2 z-10">
                            <button
                              className={`${
                                statusValues[index] === "Complete" ? "text-green-500" : "text-gray-500"
                              } block px-4 py-2`}
                              onClick={() => {
                                completeTodo(todo._id, index);
                                toggleDropdown(index);
                              }}
                            >
                              Complete
                            </button>
                            <button
                              className={`${
                                statusValues[index] === "Delete" ? "text-red-500" : "text-gray-500"
                              } block px-4 py-2`}
                              onClick={() => {
                                deleteTodo(todo._id, index);
                                toggleDropdown(index);
                              }}
                            >
                              Delete
                            </button>
                            <button
                              className="block px-4 py-2 text-gray-500"
                              onClick={() => {
                                setEditTodo(todo);
                                toggleDropdown(index);
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b hover:bg-gray-100">
                  <td colSpan={5} className="px-6 py-4 font-medium text-center text-gray-900">
                    No Todos found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-5">
              <button
                onClick={exportGist}
                className="px-4 py-2 text-white bg-green-600 border border-green-600 rounded hover:bg-green-700"
              >
                Export as gist
              </button>
            </div>
      </div>
    </div>
  );
};

export default MyTodos;
