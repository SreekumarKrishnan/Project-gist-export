import { query } from 'express';
import Project from '../database/models/projectShcema.js';
import User from '../database/models/userSchema.js';
import Todo from '../database/models/todoSchema.js';
import { createToken, getUserData } from '../helper/getUserData.js';
const CLIENT_ID = 'Ov23liTb7awx08y8CjLq';
const CLIENT_SECRET = 'f0420bdde1810c35473ea7089599929924a262ed';
import { Octokit } from '@octokit/core';
import fs from 'fs';
import path from 'path';

export const getAccessToken = async (req, res) => {
  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: req.query.code,
    });

    const response = await fetch(
      `https://github.com/login/oauth/access_token?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const data = await response.json();

    const maxAge = 3 * 24 * 60 * 60;
    const token = createToken(data.access_token);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    let userData;
    if (data.access_token) {
      userData = await getUserData(data.access_token);
      const userExist = await User.findOne({ name: userData.login });
      if (userExist) {
        await User.updateOne(
          { name: userData.login },
          { $set: { acessToken: data.access_token } },
        );
      } else {
        const user = new User({
          name: userData.login,
          acessToken: data.access_token,
        });

        await user.save();
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Failed to get access token' });
    }

    res.json(userData.login);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to get access token' });
  }
};

export const createProject = async (req, res) => {
  try {
    const projectExist = await Project.findOne({
      title: req.body.newProject.title,
    });
    if (projectExist) {
      return res.status(400).json({ message: 'Project already exist' });
    }
    const project = new Project({
      userName: req.body.name,
      title: req.body.newProject.title,
      description: req.body.newProject.description,
    });
    await project.save();

    res
      .status(200)
      .json({ success: true, message: 'Project successfully created' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res
      .status(200)
      .json({ projects, success: true, message: 'Projects get successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const findProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res
      .status(200)
      .json({ project, success: true, message: 'Project get successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const addTodos = async (req, res) => {
  const { description, id } = req.body;
  try {
    const todo = new Todo({
      description: description,
      projectId: id,
    });
    todo.save();
    res
      .status(200)
      .json({ success: true, message: 'Todo successfully created' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ projectId: req.query.project });
    res
      .status(200)
      .json({ todos, success: true, message: 'Todos get successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const completeTodo = async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.params.id },
      { $set: { status: 'Complete' } },
    );
    res
      .status(200)
      .json({ success: true, message: 'Todo successfully completed' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ success: true, message: 'Todo successfully deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const updateTodo = async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.params.id },
      { $set: { description: req.body.description } },
    );
    res
      .status(200)
      .json({ success: true, message: 'Todo successfully updated' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const updateProject = async (req, res) => {
  try {
    await Project.updateOne(
      { _id: req.params.id },
      { $set: { title: req.body.title } },
    );
    res
      .status(200)
      .json({ success: true, message: 'Project title successfully updated' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const createGist = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id });
    const user = await User.findOne({ name: project.userName });
    const todos = await Todo.find({ projectId: req.params.id });
    const token = user.acessToken;

    const octokit = new Octokit({ auth: token });

    const pendingTodos = await Todo.find({
      projectId: req.params.id,
      status: 'Pending',
    });
    const completedTodos = await Todo.find({
      projectId: req.params.id,
      status: 'Complete',
    });

    const content = `# ${project.title}
      
  Summary: ${completedTodos.length} / ${todos.length} completed.
  
  ## Pending Todos
  ${pendingTodos.map((todo) => `- [ ] ${todo.description}`).join('\n')}
  
  ## Completed Todos
  ${completedTodos.map((todo) => `- [x] ${todo.description}`).join('\n')}
      `;

    const dirname = path.resolve('GistFiles');

    // Define the file path and name
    const filePath = path.join(dirname, `${project.title}.md`);

    // Write the content to the local file
    fs.writeFileSync(filePath, content, 'utf8');

    // Create the gist on GitHub using octokit.request
    const response = await octokit.request('POST /gists', {
      description: `Project Summary: ${project.title}`,
      public: false,
      files: {
        [`${project.title}.md`]: {
          content,
        },
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    res
      .status(200)
      .json({ success: true, message: 'Gist successfully created' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out' });
  } catch (error) {
    console.log(error);
  }
};
