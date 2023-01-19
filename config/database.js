import mongoose from "mongoose";

const connect =  () => {

    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then(
        (data) => {
            console.log("Mongodb connected to server");
        }
    ).catch(
        (err) => {
            console.log(err);
        }
    )
}

export default connect