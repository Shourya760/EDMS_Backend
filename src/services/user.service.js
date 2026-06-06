import { User } from "../models/index.js";

class UserService {
  async createUser(data) {
    return await User.create(data);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async getAllUsers(){
    return await User.find();
  }

  async deleteUserByEmail(email) {
  return await User.findOneAndDelete({ email });

  
}
}

export default new UserService(); 
