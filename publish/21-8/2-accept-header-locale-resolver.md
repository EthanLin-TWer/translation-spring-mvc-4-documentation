# 21.8.2 Accept请求头解析器AcceptHeaderLocaleResolver

`AcceptHeaderLocaleResolver`解析器会检查客户端（比如，浏览器，等）所发送的请求中是否携带`accept-language`请求头。通常，该请求头字段中包含了客户端操作系统的地区信息。_不过请注意，该解析器不支持时区信息的解析。_
