const express = require('express');
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const Task = require('./task-model')
const app = express();
app.use(express.json());
const PORT = 3000;

app.listen(PORT, async()=>{
    console.log(`listening on port ${PORT}`)
})

mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log('mongodb connected')
    }
    ).catch((err)=>{
         console.log(err.message)
    })

app.get('/api/tasks', async(req,res)=>{
    try{
        const tasks = await Task.find();
        res.json(tasks);
    }
    catch(err){
        res.json({error: err.message})
    }
})

app.get('/api/tasks/filter/:completed', async(req,res)=>{
    try{
        const completed = req.params.completed =='true'?true:false;
            const filteredTasks = await Task.aggregate([
                {$match:{completed:completed}}
            ])
                    res.json(filteredTasks)

        }
    catch(err){
        res.json({error: err.message})
    }
})

app.post('/api/tasks', async(req,res)=>{
    try{
        const task = req.body.task;
        const newTask = new Task({task:task});
        await newTask.save();
        res.json({'task added': newTask})
    }
    catch(err){
        res.json({error: err.message})
    }

})

app.put('/api/tasks/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const updatedTask =  await Task.findByIdAndUpdate(id, {completed:true}, {new:true});
        res.json({'task marked as complete': updatedTask})
    }
     catch(err){
        res.json({error: err.message})
    }
})

app.delete('/api/tasks/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        res.json('task deleted')
    }
    catch(err){
        res.json({error: err.message})
    }
})
