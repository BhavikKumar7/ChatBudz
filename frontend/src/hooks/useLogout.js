import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { toast } from "react-hot-toast";

const useLogout = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success("Logout Successfully..");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
    });

    return { logoutMutation: mutate };
}

export default useLogout