# 21.3.3 定义@RequestMapping注解的处理方法(handler method)

> [Original] An `@RequestMapping` handler method can have a very flexible signatures. The supported method arguments and return values are described in the following section. Most arguments can be used in arbitrary order with the only exception of `BindingResult` arguments. This is described in the next section.

使用`@RequestMapping`注解的处理方法可以拥有非常灵活的方法签名，它支持的方法参数及返回值类型将在接下来的小节讲述。大多数参数都可以任意的次序出现，除了唯一的一个例外：`BindingResult`参数。这在下节也会详细描述。

> [Original] Spring 3.1 introduced a new set of support classes for `@RequestMapping` methods called `RequestMappingHandlerMapping` and `RequestMappingHandlerAdapter` respectively. They are recommended for use and even required to take advantage of new features in Spring MVC 3.1 and going
forward. The new support classes are enabled by default from the MVC namespace and with use of the MVC Java config but must be configured explicitly if using
neither.

> Spring 3.1中新增了一些类，用以增强注解了`@RequestMapping`的处理方法，分别是`RequestMappingHandlerMapping`类和`RequestMappingHandlerAdapter`类。我们鼓励使用这组新的类，如果要使用Spring 3.1及以后版本的新特性，这组类甚至是必须使用的。这些增强类在MVC的命名空间配置和MVC的Java编程方式配置中都是默认开启的，如果不是使用这两种方法，那么就需要显式地配置。

## 支持的方法参数类型

> [Original] The following are the supported method arguments:

下面列出所有支持的方法参数类型：

> [Original] * Request or response objects (Servlet API). Choose any specific request or response type, for example `ServletRequest` or `HttpServletRequest`.
> 
> [Original] * Session object (Servlet API): of type `HttpSession`. An argument of this type enforces the presence of a corresponding session. As a consequence, such an argument is never `null`.

* 请求或响应对象（Servlet API）。可以是任何具体的请求或响应类型的对象，比如，`ServletRequest`或`HttpServletRequest`对象等。
* `HttpSession`类型的会话对象（Servlet API）。使用该类型的参数将要求这样一个session的存在，因此这样的参数永不为`null`。

> [Original] Session access may not be thread-safe, in particular in a Servlet environment. Consider setting the RequestMappingHandlerAdapter's "synchronizeOnSession" flag to "true" if multiple requests are allowed to access a session concurrently.

> 存取session可能不是线程安全的，特别是在一个Servlet的运行环境中。如果应用可能有多个请求同时并发存取一个session场景，请考虑将RequestMappingHandlerAdapter类中的"synchronizeOnSession"标志设置为"true"。

> [Original] * `org.springframework.web.context.request.WebRequest` or `org.springframework.web.context.request.NativeWebRequest`. Allows for generic request parameter access as well as request/session attribute access, without ties to the native Servlet/Portlet API.
> 
> [Original] * `java.util.Locale` for the current request locale, determined by the most specific locale resolver available, in effect, the configured `LocaleResolver` / `LocaleContextResolver` in an MVC environment.
> 
> [Original] * `java.util.TimeZone` (Java 6+) / `java.time.ZoneId` (on Java 8) for the time zone associated with the current request, as determined by a `LocaleContextResolver`.
> 
> [Original] * `java.io.InputStream` / `java.io.Reader` for access to the request's content. This value is the raw InputStream/Reader as exposed by the Servlet API.
> 
> [Original] * `java.io.OutputStream` / `java.io.Writer` for generating the response's content. This value is the raw OutputStream/Writer as exposed by the Servlet API.
> 
> [Original] * `org.springframework.http.HttpMethod` for the HTTP request method.
> 
> [Original] * `java.security.Principal` containing the currently authenticated user.

* `org.springframework.web.context.request.WebRequest`或`org.springframework.web.context.request.NativeWebRequest`。允许存取一般的请求参数和请求/会话范围的属性（attribute），同时无需绑定使用Servlet/Portlet的API
* 当前请求的地区信息`java.util.Locale`，由已配置的最相关的地区解析器解析得到。在MVC的环境下，就是应用中配置的`LocaleResolver`或`LocaleContextResolver`
* 与当前请求绑定的时区信息`java.util.TimeZone`（java 6以上的版本）/`java.time.ZoneId`（java 8），由`LocaleContextResolver`解析得到
* 用于存取请求正文的`java.io.InputStream`或`java.io.Reader`。该对象与通过Servlet API拿到的输入流/Reader是一样的
* 用于生成响应正文的`java.io.OutputStream`或`java.io.Writer`。该对象与通过Servlet API拿到的输出流/Writer是一样的
* `org.springframework.http.HttpMethod`。可以拿到HTTP请求方法
* 包装了当前被认证用户信息的`java.security.Principal`





> [Original] 