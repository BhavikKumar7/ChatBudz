import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}},
                {$id: {$nin: currentUser.friends}},
                {isOnboarded: true}
            ]
        });
        res.status(200).json({
            success : true,
            recommendedUsers
        });
    } catch (error) {
        console.error("Error in getRecommended controller", error.message);
        res.status(500).json({
            msg : "Internal Server Error.."
        });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller.", error.message);
        res.status(500).json({
            msg : "Internal Server Error.."
        });
    }
}