module.exports = {
  success: (data, msg) => {
    return {
      data: data,
      code: 200,
      msg: msg || '请求成功！',
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
