import Todo from '../models/Todo.js';


// CREATE TODO
export const createTodo = async(req,res)=>{
    const {title}= req.body;
    
    if(!title){
        return res.json({
            success:false,
            message:"Title Is Required",
        });
    }

    try {
        const todo = await Todo.create({
            title,
            user: req.user._id,//from middleware
        });

        return res.json({
            success:true,
            message:"Todo Created",
            todo,
        });

    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
};

// GET TODOS(only user's todos)
export const getTodos = async(req,res)=>{
    try {
        const todos = await Todo.find({user: req.user._id});
        return res.json({
            success:true,
            todos,
        });
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
};

// UPDATE TODO
export const updateTodo = async(req,res)=>{
    const {id} = req.params;

    try {
        const todo = await Todo.findById(id);
        
        if(!todo){
            return res.json({
                success:false,
                message:"Todo Not Found",
            });
        }
        // check ownership
        if(todo.user.toString() !== req.user._id.toString()){
            return res.json({
                success:false,
                message:"Not Authorized",
            });
        }
        // update
        todo.completed = !todo.completed;

        await todo.save();
        
        return res.json({
            success:true,
            message:"Todo Updated",
            todo,
        });
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
};

// DELETE TODO
export const deleteTodo = async(req,res)=>{
    const {id} = req.params;

    try {
        const todo = await Todo.findById(id);

        if(!todo){
            return res.json({
                success:false,
                message:"Todo Not Found",
            });
        }

        // check ownership
        if(todo.user.toString() !== req.user._id.toString()){
            return res.json({
                success: false,
                message: "Not Authorized",
            });
        }

        await todo.deleteOne();

        return res.json({
            success: true,
            message:"Todo Deleted",
        });

    } catch (error) {
       return res.json({
        success: false,
        message: error.message,
       });
    }
};