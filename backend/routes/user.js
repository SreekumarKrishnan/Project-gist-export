import express from "express"
import { addTodos, completeTodo, createGist, createProject, deleteTodo, findProject, getAccessToken, getAllProjects, getTodos, logout, updateProject, updateTodo } from "../controllers/userController.js"
import { requireAuth } from "../helper/getUserData.js";



const router = express.Router()


router.get('/getAccessToken', getAccessToken)
router.post('/creatProject', requireAuth, createProject)
router.get('/projects', requireAuth, getAllProjects);
router.put('/project/update/:id', requireAuth, updateProject)
router.get('/findProject/:id', requireAuth, findProject)
router.post('/addTodos', requireAuth, addTodos)
router.get('/getTodos', requireAuth, getTodos)
router.put('/todos/complete/:id', requireAuth, completeTodo)
router.delete('/todos/delete/:id', requireAuth, deleteTodo)
router.put('/todos/update/:id', requireAuth, updateTodo)
router.post('/projects/:id/export', requireAuth, createGist)
router.post('/logout', logout) 
export default router