# 21.11.3 处理一般的Spring MVC异常

处理请求的过程中，Spring MVC可能会抛出一些的异常。`SimpleMappingExceptionResolver`可以根据需要很方便地将任何异常映射到一个默认的错误视图。但，如果客户端是通过自动检测响应的方式来分发处理异常的，那么后端就需要为响应设置对应的状态码。根据抛出异常的类型不同，可能需要设置不同的状态码来标识是客户端错误（4xx）还是服务器端错误（5xx）。

默认处理器异常解析器`DefaultHandlerExceptionResolver`会将Spring MVC抛出的异常转换成对应的错误状态码。该解析器在MVC命名空间配置或MVC Java配置的方式下默认已经被注册了，另外，通过`DispatcherServlet`注册也是可行的（即不使用MVC命名空间或Java编程方式进行配置的时候）。下表列出了该解析器能处理的一些异常，及他们对应的状态码。

| 异常 | HTTP状态码 |
| --- | --- |
| `BindException` | 400 (无效请求) |
| `ConversionNotSupportedException` | 500 (服务器内部错误) |
| `HttpMediaTypeNotAcceptableException` | 406 (不接受) |
| `HttpMediaTypeNotSupportedException` | 415 (不支持的媒体类型) |
| `HttpMessageNotReadableException` | 400 (无效请求) |
| `HttpMessageNotWritableException` | 500 (服务器内部错误) |
| `HttpRequestMethodNotSupportedException` | 405 (不支持的方法) |
| `MethodArgumentNotValidException` | 400 (无效请求) |
| `MissingServletRequestParameterException` | 400 (无效请求) |
| `MissingServletRequestPartException` | 400 (无效请求) |
| `NoHandlerFoundException` | 404 (请求未找到) |
| `NoSuchRequestHandlingMethodException` | 404 (请求未找到) |
| `TypeMismatchException` | 400 (无效请求) |
| `MissingPathVariableException` | 500 (服务器内部错误) |
| `NoHandlerFoundException` | 404 (请求未找到) |

以下待翻译。

The `DefaultHandlerExceptionResolver` works transparently by setting the
status of the response. However, it stops short of writing any error content
to the body of the response while your application may need to add developer-
friendly content to every error response for example when providing a REST
API. You can prepare a `ModelAndView` and render error content through view
resolution -- i.e. by configuring a `ContentNegotiatingViewResolver`,
`MappingJackson2JsonView`, and so on. However, you may prefer to use
`@ExceptionHandler` methods instead.

If you prefer to write error content via `@ExceptionHandler` methods you can
extend `ResponseEntityExceptionHandler` instead. This is a convenient base for
`@ControllerAdvice` classes providing an `@ExceptionHandler` method to handle
standard Spring MVC exceptions and return `ResponseEntity`. That allows you to
customize the response and write error content with message converters. See
the `ResponseEntityExceptionHandler` javadocs for more details.
