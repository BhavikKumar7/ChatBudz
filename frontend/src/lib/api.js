import { axiosInstance } from "./axios";

export const signup =  async (SignupData) => {
      const response = await axiosInstance.post("/auth/signup", SignupData);
      return response.data;
};