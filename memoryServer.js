const http = require('http');
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
const sequelize = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');

const sequelizeConnection = new Sequelize('postgres://postgres:Szafranowa1998@@localhost:5432/postgres', {
    define:{
        timestamps: false,
        schema: 'kp_memory'
    }
});

const Memory = sequelizeConnection.define("memories",{
    memName :{
        type: DataTypes.STRING,
        field: 'memory_name',
        primaryKey: true
    },
    memDesc :{
        type: DataTypes.STRING,
        field: 'memory_desc',
    },
    memDate :{
        type: DataTypes.DATEONLY,
        field: 'memory_date',
    }
})

app.use(cors());

app.get('/memories', (req,res)=>{
    Memory.findAll().then(memories=>{
        let listOfMemories = JSON.stringify(memories);
        res.setHeader('Content-type', 'application/json')
        res.send(listOfMemories);
    })
})

app.get('/memories/:name', (req,res)=>{
    const name = req.params['name'];
    Memory.findByPk(name).then(memory=>{
        if(memory){
            res.send(memory);
        }
        else{
            res.status(404).send("memory does not exist.");
        }
    })
})

app.post('/memories', (req,res)=>{
    const memoryData = req.body;
    Memory.create({
        memName: memoryData.memName,
        memDesc: memoryData.memDesc,
        memDate: memoryData.memDate
    })
    res.status(201).send("Memory saved...");
})

app.delete('/memories/:name', (req,res)=>{
    const name = req.params['name'];
    Memory.findByPk(name).then(memory=>{
        if(memory){
            Memory.destroy({
                where:{memName:name}
            })
            res.status(200).send("memory forgotten...");
        }
        else{
            res.status(404).send("memory not found...")
            console.log("PROBLEM");
        }
    })
})








sequelizeConnection.authenticate().then(()=>{
    console.log("DB connection was succesful");
}).catch((error)=>{
    console.log(error);
})

sequelizeConnection.sync().then(()=>{
    console.log("tables created succesfuly");
})

const server = http.createServer(app);
server.listen(3000, '127.0.0.1', ()=>{
    console.log("server started");
})