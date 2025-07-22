import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api';
import toast from 'react-hot-toast';

const useLogin = () => {
  const queryClient = useQueryClient();
  
    const { mutate, isPending, error } = useMutation({
      mutationFn: login,
      onSuccess: () => {
        toast.success("Login successfully");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    });
    
    return { error, isPending, loginMutation: mutate };

};

export default useLogin