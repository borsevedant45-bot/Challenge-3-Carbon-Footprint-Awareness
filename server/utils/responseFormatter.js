export const successResponse = (res, data = {}, message = 'Operation successful', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Something went wrong', status = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(status).json(response);
};
