'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Comment)
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'UserId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedRestaurants'
      })
      //固定 followingId, 所以可以找出所有在追蹤followingId的users
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      //固定 followerId, 所以可以找出followerId在追蹤的所有users
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,   // 加入這行
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};