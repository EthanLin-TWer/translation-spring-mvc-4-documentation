# 21.11.4 使用@ResponseStatus注解业务异常

业务异常可以使用`@ResponseStatus`来注解。当异常被抛出时，`ResponseStatusExceptionResolver`会通过设置相应的响应状态码处理该异常。`DispatcherServlet`会默认注册一个`ResponseStatusExceptionResolver`以供使用。
