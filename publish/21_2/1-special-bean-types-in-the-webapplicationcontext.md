# 21.2.1 WebApplicationContext中特别的bean类型

> The Spring DispatcherServlet uses special beans to process requests and render the appropriate views. These beans are part of Spring MVC. You can choose which special beans to use by simply configuring one or more of them in the WebApplicationContext. However, you don’t need to do that initially since Spring MVC maintains a list of default beans to use if you don’t configure any. More on that in the next section. First see the table below listing the special bean types the DispatcherServlet relies on.

Spring的`DispatcherServlet`使用了特殊的bean来处理请求、渲染视图等，这些特定的bean是Spring MVC框架的一部分。如果你想指定使用哪个特定的bean，你可以在`WebApplicationContext`中简单地配置它们（没有忠于原文）。当然，这不是必须的，因为Spring MVC维护了一个默认的bean列表，如果你没有进行特别的配置，框架将会使用默认的bean。下一小节会介绍更多的细节，这里，我们将先快速地看一下，`DispatcherServlet`都依赖于哪些特殊的bean来进行它的初始化。

> | Bean Type | Explanation | 
> | :-------- | :---------- |
> | [`HandlerMapping`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-handlermapping)| Maps incoming requests to handlers and a list of pre- and post-processors (handler interceptors) based on some criteria the details of which vary by `HandlerMapping` implementation. The most popular implementation supports annotated controllers but other implementations exists as well. |
> | `HandlerAdapter` | Helps the `DispatcherServlet` to invoke a handler mapped to a request regardless of the handler is actually invoked. For example, invoking an annotated controller requires resolving various annotations. Thus the main purpose of a `HandlerAdapter` is to shield the `DispatcherServlet` from such details. |
> | [`HandlerExceptionResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-exceptionhandlers)| Maps exceptions to views also allowing for more complex exception handling code. |
> | [`ViewResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-viewresolver)| Resolves logical String-based view names to actual View types. |
> | [`LocaleResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-localeresolver) & [`LocaleContextResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-timezone)| Resolves the locale a client is using and possibly their time zone, in order to be able to offer internationalized views. |
> | [`ThemeResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-themeresolver) | Resolves themes your web application can use, for example, to offer personalized layouts. |
> | [`MultipartResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-multipart) | Parses multi-part requests for example to support processing file uploads from HTML forms. |
> | [`FlashMapManager`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-flash-attributes) | Stores and retrieves the "input" and the "output" `FlashMap` that can be used to pass attributes from one request to another, usually across a redirect. |


| bean的类型 | 作用 | 
| :-------- | :---------- |
| [`HandlerMapping`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-handlermapping)| 根据某些规则将外部请求映射到具体的处理器（handler）以及一系列前处理器和后处理器（hanlder interceptors）上。具体的规则视`HandlerMapping`类的实现不同而有所不同。最常用的handler实现支持控制器（controller）上基于注解的配置。当然，也存在其他的handler实现。 |
| `HandlerAdapter` | 辅助`DispatcherServlet`调用到负责处理某个具体请求的处理器，而无需关心具体去调用哪一个处理器。比如说，要调用基于注解配置的控制器将需要事先解析许多的注解。因此，`HandlerAdapter`的主要任务，就是将`DispatcherServlet`从这些具体的细节中解放出来，交给它来处理。 |
| [`HandlerExceptionResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-exceptionhandlers)| 将捕获的异常映射到不同的页面上去以支持更加复杂的异常处理代码。 |
| [`ViewResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-viewresolver)| 将有命名规则的String类型的视图名称解析到一个对应的视图上。 |
| [`LocaleResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-localeresolver) & [`LocaleContextResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-timezone)| 解析客户端所使用的地区（locale）甚至时区信息，为定制了国际化的视图提供支持。 |
| [`ThemeResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-themeresolver) | 解析web应用所能使用的主题，比如提供一些定制化的布局、视图等。 |
| [`MultipartResolver`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-multipart) | 解析多部分传输的请求，比如支持通过HTML表单进行的文件上传的处理等。 |
| [`FlashMapManager`](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-flash-attributes) | 能够存储并取回负责输入输出（input and output）的`FlashMap`对象。后者可用于在请求之间传递数据，通常是在请求的重定向情境下使用。 |

