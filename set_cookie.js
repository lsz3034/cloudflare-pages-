// 设置 cookie 函数
function setcookie(headers, key, value, requestHeaders) {
    // 获取已有的 cookies
    const existingCookies = getcookie(requestHeaders);
  
    // 将所有 cookie 值转换为字符串格式
    existingCookies[key] = String(value);
  
    // 加密密钥
    const encryptionKey = "a123654789";
  
    // 删除已有的 tk cookie（如果存在）
    if (existingCookies['tk']) {
      delete existingCookies['tk'];
    }
  
    // 对 cookie 对象进行排序
    const sortedCookies = sortObject(existingCookies);
  
    // 遍历排序后的 cookie 对象并设置 cookie 字符串
    for (const [cookieKey, cookieValue] of Object.entries(sortedCookies)) {
      const cookieString = `${cookieKey}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax`;
      headers.append('Set-Cookie', cookieString);
    }
  
    // 将排序后的 cookies 转换为 JSON 字符串并加密
    const encryptedCookies = btoa(JSON.stringify(sortedCookies) + encryptionKey);
    // 设置加密后的 tk cookie
    headers.append('Set-Cookie', `tk=${encryptedCookies}; Path=/; HttpOnly; SameSite=Lax`);
  
    return headers;
}
  
// 获取 cookies 的函数
function getcookie(headers) {
    // 从请求头中获取 Cookie 字符串
    const cookieString = headers.get('Cookie');
    const cookies = {};
    if (cookieString) {
      // 将 Cookie 字符串分割为各个 cookie 项
      cookieString.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.split('=');
        const value = rest.join('=').trim();
        cookies[name.trim()] = value;
      });
    }
    return cookies;
}
  
// 验证 token 的函数
function verifyToken(headers) {
    // 获取 cookies
    const cookies = getcookie(headers);
    const token = cookies['tk'];
  
    // 如果没有 tk token，则返回空对象
    if (!token) {
      return {};
    }
  
    // 加密密钥
    const encryptionKey = "a123654789";
    // 删除 tk cookie
    delete cookies['tk'];
  
    // 对剩余的 cookie 对象进行排序
    const sortedCookies = sortObject(cookies);
  
    // 对排序后的 cookies 进行加密
    const encryptedCookies = btoa(JSON.stringify(sortedCookies) + encryptionKey);
  
    // 验证加密后的 token 是否与请求中的 token 相同
    if (token === encryptedCookies) {
      return cookies;
    } else {
      return {};
    }
}
  
// 清除所有 cookies 的函数
function clearCookies(headers) {
    // 获取所有 cookies
    const cookies = getcookie(headers);
    
    // 遍历所有 cookies 并设置过期时间清除它们
    for (const cookieKey of Object.keys(cookies)) {
      const cookieString = `${cookieKey}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      headers.append('Set-Cookie', cookieString);
    }
  
    return headers;
}
  
// 对对象的键进行排序的函数
function sortObject(obj) {
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}