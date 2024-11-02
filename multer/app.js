import express from "express";
import multer from "multer";
import crypto from 'crypto'
import path from "path";

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/images/uploads');
    },
    filename : function(req,file,cb){
        console.log("file in storage : ",file);
        console.log("cb in stroage : ",cb);
        crypto.randomBytes(12,(err,bytes)=>{
            if (err) return cb(err);
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(null,fn);
        })
    }
})

const upload = multer({storage});

app.get("/",(req,res)=>{
    res.render("index");
})

app.post('/upload',upload.single("image"),(req,res)=>{
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }
    console.log(req.file);
    res.send("File uploaded successfully");
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});