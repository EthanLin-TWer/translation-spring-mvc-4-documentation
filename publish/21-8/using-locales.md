# 21.8 地区信息（Locales）

Spring的架构中的很多层面都提供了对国际化的支持，同样支持Spring MVC框架也能提供。`DispatcherServlet`为你提供了自动使用用户的地区信息来解析消息的能力。而这，是通过`LocaleResolver`对象来完成的。

一个请求进入处理时，`DispatcherServlet`会查找一个地区解析器。如果找到，就尝试使用它来设置地区相关的信息。通过调用`RequestContext.getLocale()`都能取到地区解析器所解析到的地区信息。

此外，如果你需要自动解析地区信息，你可以在处理器映射前加一个拦截器（关于更多处理器映射拦截器的知识，请参见[21.4.1 使用HandlerInterceptor拦截请求](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-handlermapping-interceptor)一小节），并用它来根据条件或环境不同，比如，根据请求中某个参数值，来更改地区信息。
