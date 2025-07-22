import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        if(!email || !password || !fullName){
            return res.status(400).json({
                msg : "All fields are required.."
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                msg : "Password must be have at least 6 characters.."
            })
        } 
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                msg : "Invalid email format.."
            })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                msg : "Email already exists, pls use a different one.."
            })
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })

        try {
            await upsertStreamUser({
                id : newUser._id.toString(),
                name : newUser.fullName,
                image : newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating Stream user: ", error);
        }

        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt",token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevents CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            success : true,
            user : newUser
        })

    } catch (error) {
        console.log("Error in SignUp controller", error.message);
        res.status(500).json({
            msg : "Internal server Error.."
        })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                msg : "All fields are required.."
            })
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({
                msg : "Invalid email or password.."
            })
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                msg : "Invalid email or password.."
            })
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt",token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevents CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({
            success : true, 
            user
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({
            msg : "Internal Server Error.."
        })
    }
}

export function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({
        success : true,
        msg : "Logout Successfully.."
    })
}

export async function onboard(req, res){
    try {
        const userId = req.user._id;

        const { fullName, bio, gender, sexuality, age, dob, hoobies, nativeLanguage, location } = req.body;

        if(!fullName || !bio || !gender || !sexuality || !age || !dob || !hoobies || !nativeLanguage || !location) {
            return res.status(400).json({
                msg : "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !gender && "gender",
                    !sexuality && "sexuality",
                    !age && "age",
                    !nativeLanguage && "nativeLanguage",
                    !location && "location",
                ].filter(Boolean),
            })
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new:true})

        if(!updateUser){
            return res.status(404).json({
                msg : "User not found.."
            });
        }

        try {
            await upsertStreamUser({
                id : updateUser._id.toString(),
                name : updateUser.fullName,
                image : updateUser.profilePic || "",
            });
            console.log(`Stream user updated after onboarding for ${updateUser.fullName}`);
        } catch (error) {
            console.log("Error updating stream user during onboarding: ", streamError.message);
        }

        res.status(200).json({
            success : true,
            user : updateUser
        });
    } catch (error) {
        console.error("Onboarding error: ", error);
        res.status(500).json({
            msg : "Internal server error"
        });
    }
}