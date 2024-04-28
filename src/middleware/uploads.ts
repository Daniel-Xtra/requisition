import multer from "multer";

// import { mkdirP } from "../utils/helpers";
import { AppError } from "../utils/app-error";

export const FrontendAssetsUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // mkdirP("public");
      // mkdirP("public/categories");
      // cb(null, "./public/categories/");
    },
    filename: function (req, file, cb) {
      const fileName = file.fieldname;
      const fieldTime = Date.now();
      const originalName = file.originalname;
      const extension = originalName.slice(originalName.lastIndexOf("."));
      const newFileName = `${fileName}-${fieldTime}${extension}`;

      cb(null, newFileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
      throw new AppError("Photo must contain jpeg or png type file", null, 400);
    }
  },
});
