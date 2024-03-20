import * as path from "node:path";
import * as crypto from "crypto";
import multer from "multer";

const storage = multer.diskStorage({
    destination: path.resolve("tmp"), 
    filename: (req, file, cb)=> {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const suf = crypto.randomUUID();
        const newFilename = `${basename}--${suf}${extname}`;
        console.log(newFilename)
        cb(null, newFilename);
    }

})

export const upload = multer({
  storage: storage,
});