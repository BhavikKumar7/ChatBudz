import { MapPinIcon } from "lucide-react";
import { Link } from "react-router"

const FriendCard = ({ friend }) => {
    const capitilize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return (
        <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">

                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12">
                        <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{friend.fullName}</h3>
                        {friend.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {friend.location}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-secondary text-xs">
                        {capitilize(friend.gender) || "N/A"}
                    </span>
                    <span className="badge badge-secondary text-xs">
                        {capitilize(friend.sexuality) || "N/A"}
                    </span>
                    <span className="badge badge-secondary text-xs">
                        {friend.age || "N/A"}
                    </span>
                    <span className="badge badge-secondary text-xs">
                        {capitilize(friend.nativeLanguage?.[0]) || "N/A"}
                    </span>
                </div>

                <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
                    Message
                </Link>

            </div>
        </div>
    )
}

export default FriendCard