# set_cookie.js  Cookie 管理代码功能概述

这段代码实现了一套用于管理 HTTP 请求中的 Cookies 的工具函数，主要功能包括设置 Cookies、获取 Cookies、验证加密的 Cookies 令牌以及清除 Cookies。

## 主要功能

1. **setcookie(headers, key, value, requestHeaders)**
   - 设置指定的 Cookie 键值对，并在 Headers 中添加相应的 Cookie。
   - 将现有的 Cookies 排序并转换为字符串，然后生成加密的 `tk` Cookie，用于对 Cookies 进行完整性验证。

2. **getcookie(headers)**
   - 从请求头中提取 Cookies，并将其解析为键值对对象。

3. **verifyToken(headers)**
   - 验证 Cookies 中的加密令牌 `tk` 是否与其他 Cookies 的加密结果匹配，以此判断 Cookies 的完整性。

4. **clearCookies(headers)**
   - 清除请求中的所有 Cookies，将它们的过期时间设置为过去的日期。

5. **sortObject(obj)**
   - 对对象的键进行排序，确保 Cookies 在设置和验证时的一致性。

## 代码中的加密逻辑

代码通过将 Cookies 对象转换为 JSON 字符串后，附加上加密密钥（`a123654789`）并使用 `btoa` 进行 Base64 编码来生成加密的 `tk` Cookie。这种方式确保 Cookies 的完整性，防止被篡改。

## 安全特性

- **HttpOnly**: 设置 Cookies 的 `HttpOnly` 属性，防止客户端脚本访问。
- **SameSite=Lax**: 通过设置 `SameSite` 属性，减少跨站请求伪造（CSRF）攻击的风险。
- **Path=/**: 设置 Cookies 在整个网站范围内有效。
