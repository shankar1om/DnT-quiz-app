const categoryRepository = require('../repository/category.repository');

const createCategory = async (categoryData) => {
  return await categoryRepository.createCategory(categoryData);
};

const getAllCategories = async () => {
  return await categoryRepository.findAllCategories();
};

const updateCategory = async (id, update) => {
  const category = await categoryRepository.updateCategoryById(id, update);
  if (!category) throw { status: 404, message: 'Category not found' };
  return category;
};

const deleteCategory = async (id) => {
  const category = await categoryRepository.deleteCategoryById(id);
  if (!category) throw { status: 404, message: 'Category not found' };
  return category;
};

const getQuestionsForCategory = async (categoryId) => {
  const quizzes = await categoryRepository.findQuizzesByCategory(categoryId);
  const quizIds = quizzes.map(q => q._id);
  const questions = await categoryRepository.findQuestionsByQuizIds(quizIds);
  return questions;
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getQuestionsForCategory,
}; 