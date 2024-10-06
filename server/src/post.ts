import express, { Request, Response } from "express";
import multer from "multer";
import { PostModel } from "./database/models/Post";
import { UserModel } from "./database/models/User";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      
      const ext = path.extname(file.originalname);
      
      // add original extension to generated name
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

// Create a new post
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
        try {
            const file = req.file;
            const coordinates = JSON.parse(req.body.coordinates);
            if (file) {
                req.body.imageId = file.filename;
            }

            if (!req.body.title || !req.body.text) {
                return res.status(400).send("Title and text are required");
            } else if (
                typeof req.body.title !== "string" ||
                typeof req.body.text !== "string"
            ) {
                return res.status(400).send("Title and text must be strings");
            } else if (
                req.body.title.length < 3 ||
                req.body.title.length > 50
            ) {
                return res
                    .status(400)
                    .send("Title must be between 3 and 50 characters");
            } else if (req.body.text.length < 3 || req.body.text.length > 500) {
                return res
                    .status(400)
                    .send("Text must be between 3 and 500 characters");
            } else if (req.body.userId && typeof req.body.userId !== "string") {
                return res.status(400).send("Author must be a string");
            } else if (
                coordinates.length !== 2 ||
                typeof coordinates[0] !== "number" ||
                typeof coordinates[1] !== "number"
            ) {
                return res
                    .status(400)
                    .send("Coordinates must be an array of two numbers");
            }

            const user = await UserModel.findOne({ clerkId: req.auth.userId });

            if (!user) {
                return res.status(404).send("User not found");
            }

            // Create a new post
            const post = new PostModel({
                title: req.body.title,
                text: req.body.text,
                user: user._id,
                coordinates: coordinates,
                date: new Date().toString(),
                imageId: req.body.imageId || null,
            });

            post.save();

            return res.status(201).send("Post created");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal server error");
        }
    }
);

// Read all posts
router.get("/", async (req: Request, res: Response) => {
    try {
        let page = Number(req.query.page || 1);
        const coordinate1 = req.query.x;
        const coordinate2 = req.query.y;

        if (!coordinate1 || !coordinate2) {
            return res.status(400).send("Coordinates are required");
        }

        if (isNaN(page)) {
            page = 1;
        }

        const radius = 5 / 6378.1; // Radius of the Earth in kilometers

        const coordinate1Num = parseFloat(coordinate1 as string);
        const coordinate2Num = parseFloat(coordinate2 as string);

        if (isNaN(coordinate1Num) || isNaN(coordinate2Num)) {
            return res.status(400).send("Coordinates must be numbers");
        }

        const minLat = coordinate1Num - radius;
        const maxLat = coordinate1Num + radius;
        const minLng =
            coordinate2Num -
            radius / Math.cos(coordinate1Num * (Math.PI / 180));
        const maxLng =
            coordinate2Num +
            radius / Math.cos(coordinate1Num * (Math.PI / 180));

        const posts = await PostModel.find({
            coordinates: {
                $geoWithin: {
                    $box: [
                        [minLat, minLng],
                        [maxLat, maxLng],
                    ],
                },
            },
        })
            .populate("user")
            .sort({ date: -1})
            .skip((page - 1) * 10)
            .limit(10);

        return res.status(200).send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Read a single post by ID
router.get("/:id", (req: Request, res: Response) => {
    try {
        const postId = req.params.id;

        PostModel.findById(postId).then((post) => {
            if (!post) {
                return res.status(404).send("Post not found");
            }
            res.status(200).send(post);
        });

        res.status(200).send(`Get post with ID: ${postId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Update a post by ID
router.put("/:id", (req: Request, res: Response) => {
    try {
        const postId = req.params.id;

        let post = PostModel.findById(postId);

        post.then((post) => {
            if (!post) {
                return res.status(404).send("Post not found");
            }

            if (req.body.title) {
                post.title = req.body.title;
            }

            if (req.body.text) {
                post.text = req.body.text;
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

            post.save();
        });

        res.status(200).send(`Update post with ID: ${postId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Delete a post by ID
router.delete("/:id", (req: Request, res: Response) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndDelete(postId).then((post) => {
            if (!post) {
                return res.status(404).send("Post not found");
            }

            res.status(200).send(`Delete post with ID: ${postId}`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/image/:id", (req: Request, res: Response) => {
    try {
        const imageId = req.params.id;

        res.sendFile(imageId, { root: "uploads" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/user/:id", (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const postQuery = PostModel.find({ userId: userId });

        postQuery.then((posts) => {
            res.status(200).send(posts);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

export default router;
