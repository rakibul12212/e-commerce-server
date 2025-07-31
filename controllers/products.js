const getAllProducts = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "All products fetched successfully",
  });
};
const getAllProductsTesting = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "All testing products fetched successfully",
  });
};
module.exports = { getAllProducts, getAllProductsTesting };
