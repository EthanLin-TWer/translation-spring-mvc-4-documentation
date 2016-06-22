# 21.11.4 使用@ResponseStatus注解业务异常

业务异常可以使用`@ResponseStatus`来注解。当异常被抛出时，`ResponseStatusExceptionResolver`解析会处理该异常，它会将响应的状态码进行相应的设置。`DispatcherServlet`会默认注册一个`ResponseStatusExceptionResolver`以供使用。
