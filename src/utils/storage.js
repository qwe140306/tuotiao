// 本地存储模块

export const getItem = name => {
  const data = window.localStorage.getItem(name);
  // 为什么使用 try catch  因为data 可能不是 JSON 格式字符串, 所以转换失败直接返回data
  try {
    // 将 data 转换为JSON对象
    return JSON.parse(data);
  } catch (err) {
    // data 不是 JSON 格式字符串 直接返回data
    return data;
  }
};
export const setItem = (name, value) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(name, value);
};
export const removeItem = name => {
  window.localStorage.removeItem(name);
};

