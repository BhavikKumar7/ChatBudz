import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({
                msg: "All fields are required.."
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                msg: "Password must be have at least 6 characters.."
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                msg: "Invalid email format.."
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                msg: "Email already exists, pls use a different one.."
            })
        }
        
        const newUser = await User.create({
            email,
            fullName,
            password,
        })

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevents CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })

        const { password: _, ...userData } = newUser._doc;

        res.status(201).json({
            success: true,
            user: userData
        })

    } catch (error) {
        console.log("Error in SignUp controller", error.message);
        res.status(500).json({
            msg: "Internal server Error.."
        })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                msg: "All fields are required.."
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                msg: "Invalid email or password.."
            })
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                msg: "Invalid email or password.."
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevents CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({
            msg: "Internal Server Error.."
        })
    }
}

export function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({
        success: true,
        msg: "Logout Successfully.."
    })
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;

        const { fullName, bio, gender, sexuality, age, dob, hoobies, nativeLanguage, location, profilePic } = req.body;

        if (!fullName || !bio || !gender || !sexuality || !age || !dob || !hoobies || !nativeLanguage || !location) {
            return res.status(400).json({
                msg: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !gender && "gender",
                    !sexuality && "sexuality",
                    !age && "age",
                    !dob && "dob",
                    !hoobies && "hoobies",
                    !nativeLanguage && "nativeLanguage",
                    !location && "location",
                ].filter(Boolean),
            })
        }

        let uploadedPicUrl;
        if (profilePic) {
            const uploadRes = await cloudinary.uploader.upload(profilePic, {
                folder: "profile_pics",
            });
            uploadedPicUrl = uploadRes.secure_url;
        }

        const updatedData = {
            fullName,
            bio,
            gender,
            sexuality,
            age,
            dob,
            hoobies,
            nativeLanguage,
            location,
            isOnboarded: true,
        };

        if (uploadedPicUrl) updatedData.profilePic = uploadedPicUrl;

        const updateUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updateUser) {
            return res.status(404).json({
                msg: "User not found.."
            });
        }

        const { password: _, ...userData } = updateUser._doc;
        res.status(200).json({
            success: true,
            user: userData,
        });
    } catch (error) {
        console.error("Onboarding error: ", error);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user._id;
        const {
            profilePic,
            bio,
            gender,
            sexuality,
            hoobies,
            nativeLanguage,
            location
        } = req.body;

        if (req.body.fullName || req.body.email || req.body.dob) {
            return res.status(403).json({
                msg: "You are not allowed to update name or email or dob from this route."
            });
        }

        const updates = {
            ...(bio && { bio }),
            ...(gender && { gender }),
            ...(sexuality && { sexuality }),
            ...(hoobies && { hoobies }),
            ...(nativeLanguage && { nativeLanguage }),
            ...(location && { location })
        };

        if (profilePic) {
            const uploadRes = await cloudinary.uploader.upload(profilePic, {
                folder: "profile_pics"
            });
            updates.profilePic = uploadRes.secure_url;
        }

        const updateUser = await User.findByIdAndUpdate(userId, updates ,{ new: true } );

        if (!updateUser) {
            return res.status(404).json({
                msg: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Profile updated successfully.",
            user: updateUser
        });

    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error.."
        });
    }
}