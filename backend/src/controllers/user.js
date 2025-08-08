import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}},
                {_id: {$nin: currentUser.friends}},
                {isOnboarded: true}
            ],
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
        .populate("friends", "fullName profilePic nativeLanguage location age gender sexuality");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller.", error.message);
        res.status(500).json({
            msg : "Internal Server Error.."
        });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params

        if(myId === recipientId){
            return res.status(400).json({
                msg : "You can't send friend request to yourself"
            });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({
                msg : "Recipient not found."
            });
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({
                msg : "You are already friend with this user"
            });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if(existingRequest){
            return res.status(400).json({
                msg : "A friend request already exists between you and this user"
            });
        }

        const friendRequest = await FriendRequest.create({
            sender : myId,
            recipient : recipientId,
        });
        
        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({
            msg : "Internal server error.."
        });
    }
}

export async function acceptFriendRequest(req, res){
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({
                msg : "Friend request not found."
            });
        }

        if(friendRequest.recipient.toString() != req.user.id){
            return res.status(403).json({
                msg : "You are not authorized to accept this request"
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({
            msg : "Friend request accepted"
        });
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).status({
            msg : "Internal server error"
        });
    }
}

export async function rejectFriendRequest(req, res) {
    try {
        const { id:requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({ msg: "Friend request not found "});
        }
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ msg: "You are not authorized to reject this request."});
        }
        
        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ msg: "friend request rejected and removed." });
    } catch (error) {
        console.error("Error in rejectFriendRequest controller", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export async function getFriendRequest(req, res) {
    try {
        const incomingRequest = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic age gender sexuality nativeLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingRequest, acceptedReqs });
    } catch (error) {
        console.error("Error in getFriendRequest controller", error.message);
        res.status(500).json({
            msg : "Internal server Error"
        });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingFriendReqs = await FriendRequest.find({
            sender : req.user.id,
            status : "pending"
        }).populate("recipient", "fullName profilePic age gender nativeLanguage");

        res.status(200).json(outgoingFriendReqs);
    } catch (error) {
        console.error("Error in getOutgoingFriendReqs controller", error.message);
        res.status(500).json({
            msg : "Internal Server Error"
        });
    }
}