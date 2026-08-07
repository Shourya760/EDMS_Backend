import { User } from "../models/index.js";

class UserService {
  async createUser(data) {
    return await User.create(data);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async getAllUsers() {
    return await User.find();
  }

  async deleteUserByEmail(email) {
    return await User.findOneAndDelete({ email });
  }

  async findByEmailAndPassword(email, password) {
    return await User.findOne({ email, password })
  }

  async findUserById(userId) {
    return await User.findById(userId);
  }

  async findByPhone(phone) {
    return await User.findOne({ phone })
  }
  async updateById(id, data) {
    return await User.findByIdAndUpdate(
      id,
      data,
      { new: true }
    )
  }
}



export default new UserService(); 
