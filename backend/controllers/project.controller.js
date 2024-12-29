import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
const errors = validationResult(req);
if(!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()});
}

const {name, description} = req.body;
const loggedInUser = await userModel.findOne({email:req.user.email});
const userId = loggedInUser._id;

// Check if the project name already exists
const existingProject = await projectModel.findOne({ name });
if (existingProject) {
    return res.status(400).json({ error: "Project name must be unique." });
}

try{
    const newProject = await projectService.createProject({name, description, userId});
    res.status(201).json(newProject);
}catch(error){
    console.log(error);
    res.status(500).json({error:error.message});
}
}
