import express, { Request, Response } from "express";
import multer from "multer";
import { PostModel } from "./database/models/Post";
import { UserModel } from "./database/models/User";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
// Create a new post
router.post("/", upload.single("image"), (req: Request, res: Response) => {
    const file = req.file;
    if (file) {
        req.body.imageId = file.filename;
    }

    if (!req.body.title || !req.body.content) {
        return res.status(400).send("Title and content are required");
    } else if (
        typeof req.body.title !== "string" ||
        typeof req.body.content !== "string"
    ) {
        return res.status(400).send("Title and content must be strings");
    } else if (req.body.title.length < 3 || req.body.title.length > 50) {
        return res
            .status(400)
            .send("Title must be between 3 and 50 characters");
    } else if (req.body.content.length < 3 || req.body.content.length > 500) {
        return res
            .status(400)
            .send("Content must be between 3 and 500 characters");
    } else if (req.body.userId && typeof req.body.userId !== "string") {
        return res.status(400).send("Author must be a string");
    } else if (
        req.body.coordinates.length !== 2 ||
        typeof req.body.coordinates[0] !== "number" ||
        typeof req.body.coordinates[1] !== "number"
    ) {
        return res
            .status(400)
            .send("Coordinates must be an array of two numbers");
    } else if (req.body.date && typeof req.body.date !== "string") {
        return res.status(400).send("Date must be a string");
    } else if (req.body.date && !new Date(req.body.date).getTime()) {
        return res.status(400).send("Invalid date");
    }

    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        userId: req.body.userId,
        coordinates: req.body.coordinates,
        date: req.body.date,
        imageId: req.body.imageId || null,
        user: UserModel.findById(req.body.userId).then((user) => {
            if (!user) {
                return res.status(404).send("User not found");
            }
            return user;
        }),
    });

    post.save();

    res.status(201).send("Post created");
});

// Read all posts
router.get("/:page", (req: Request, res: Response) => {
    let page = Number(req.params.page || 1);
    if (isNaN(page)) {
        page = 1;
    }

    const postQuery = PostModel.find()
        .skip((page - 1) * 10)
        .limit(10);

    postQuery.then((posts) => {
        res.status(200).send(posts);
    });
});

// Read a single post by ID
router.get("/:id", (req: Request, res: Response) => {
    const postId = req.params.id;

    PostModel.findById(postId).then((post) => {
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.status(200).send(post);
    });

    res.status(200).send(`Get post with ID: ${postId}`);
});

// Update a post by ID
router.put("/:id", (req: Request, res: Response) => {
    const postId = req.params.id;

    let post = PostModel.findById(postId);

    post.then((post) => {
        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (req.body.title) {
            post.title = req.body.title;
        }

        if (req.body.content) {
            post.text = req.body.content;
        }

        if (req.body.hasImage) {
            if (req.body.hasImage == true && !req.body.imageId) {
                return res.status(400).send("Image ID is required");
            } else if (
                req.body.hasImage == true &&
                typeof req.body.imageId !== "string"
            ) {
                return res.status(400).send("Image ID must be a string");
            }
            post.imageId = req.body.imageId;
        }

        if (req.body.coordinates) {
            if (
                req.body.coordinates.length !== 2 ||
                typeof req.body.coordinates[0] !== "number" ||
                typeof req.body.coordinates[1] !== "number"
            ) {
                return res
                    .status(400)
                    .send("Coordinates must be an array of two numbers");
            }
            post.coordinates = req.body.coordinates;
        }

        if (req.body.date) {
            if (typeof req.body.date !== "string") {
                return res.status(400).send("Date must be a string");
            } else if (!new Date(req.body.date).getTime()) {
                return res.status(400).send("Invalid date");
            }
            post.date = req.body.date;
        }

        post.save();
    });

    res.status(200).send(`Update post with ID: ${postId}`);
});

// Delete a post by ID
router.delete("/:id", (req: Request, res: Response) => {
    const postId = req.params.id;

    PostModel.findByIdAndDelete(postId).then((post) => {
        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.status(200).send(`Delete post with ID: ${postId}`);
    });
});

export default router;
