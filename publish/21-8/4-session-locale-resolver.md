# 21.8.4 Session解析器SessionLocaleResolver

`SessionLocaleResolver`允许你从session中取得可能与用户请求相关联的地区`Locale`和时区`TimeZone`信息。与`CookieLocaleResolver`不同，这种存取策略仅将Servlet容器的`HttpSession`中相关的地区信息存取到本地。因此，这些设置仅会为该会话（session）临时保存，session结束后，这些设置就会失效。

不过请注意，该解析器与其他外部session管理机制，比如Spring的Session项目等，并没有直接联系。该`SessionLocaleResolver`仅会简单地从与当前请求`HttpServletRequest`相关的`HttpSession`对象中，取出对应的属性，并修改其值，仅此而已。
