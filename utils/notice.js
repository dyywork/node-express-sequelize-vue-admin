module.exports = {
  success: (data, msg) => {
    return {
      data: data,
      code: 200,
      msg,
    }
  },
  error: (data, msg) => {
    return {
      data: data,
      code: 500,
      msg,
    }
  }
}
