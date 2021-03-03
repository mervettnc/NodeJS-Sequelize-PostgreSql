'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Course,{
        foreignKey: 'course_id',
         as:'course',
         });
    }
  };
  Book.init({
    course_id: DataTypes.INTEGER,
    book_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};

