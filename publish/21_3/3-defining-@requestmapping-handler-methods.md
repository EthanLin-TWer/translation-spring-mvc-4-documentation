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

> [Original] * `@PathVariable` annotated parameters for access to URI template variables. See [the section called "URI Template Patterns"](mvc.html#mvc-ann-requestmapping-uri-templates "URI Template Patterns" ).
> 
> [Original] * `@MatrixVariable` annotated parameters for access to name-value pairs located in URI path segments. See [the section called "Matrix Variables"](mvc.html#mvc-ann-matrix-variables "Matrix Variables" ).
> 
> [Original] * `@RequestParam` annotated parameters for access to specific Servlet request parameters. Parameter values are converted to the declared method argument type. See [the section called "Binding request parameters to method parameters with @RequestParam"](mvc.html#mvc-ann-requestparam "Binding request parameters to method parameters with @RequestParam" ).
> 
> [Original] * `@RequestHeader` annotated parameters for access to specific Servlet request HTTP headers. Parameter values are converted to the declared method argument type. See [the section called "Mapping request header attributes with the @RequestHeader annotation"](mvc.html#mvc-ann-requestheader "Mapping request header attributes with the @RequestHeader annotation" ).

* 带`@PathVariable`注解的方法参数，其存放了URI模板变量中的值。详见[“URI模板变量”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-uri-templates "URI Template Patterns" )
* 带`@MatrixVariable`注解的方法参数，其存放了URI路径段中的键值对。详见[“矩阵变量”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-matrix-variables "Matrix Variables")
* 带`@RequestParam`注解的方法参数，其存放了Servlet请求中所指定的参数。参数的值会被转换成方法参数所声明的类型。详见[“使用@RequestParam注解绑定请求参数至方法参数”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestparam "Binding request parameters to method parameters with @RequestParam" )
* 带`@RequestHeader`注解的方法参数，其存放了Servlet请求中所指定的HTTP请求头的值。参数的值会被转换成方法参数所声明的类型。详见[“使用@RequestHeader注解映射请求头属性”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestheader "Mapping request header attributes with the @RequestHeader annotation" ).

> [Original] * `@RequestBody` annotated parameters for access to the HTTP request body. Parameter values are converted to the declared method argument type using HttpMessageConverters. See [the section called "Mapping the request body with the @RequestBody annotation"](mvc.html#mvc-ann-requestbody "Mapping the request body with the @RequestBody annotation" )
> 
> [Original] * `@RequestPart` annotated parameters for access to the content of a "multipart/form-data" request part. See [Section 21.10.5, "Handling a file upload request from programmatic clients"](mvc.html#mvc-multipart-forms-non-browsers "21.10.5 Handling a file upload request from programmatic clients" ) and [Section 21.10, "Spring's multipart (file upload) support"](mvc.html#mvc-multipart "21.10 Spring's multipart \(file upload\) support" ).
> 
> [Original] * `HttpEntity<?>` parameters for access to the Servlet request HTTP headers and contents. The request stream will be converted to the entity body using HttpMessageConverters. See [the section called "Using HttpEntity"](mvc.html#mvc-ann-httpentity "Using HttpEntity" ).
> 
> [Original] * `java.util.Map` / `org.springframework.ui.Model` / `org.springframework.ui.ModelMap` for enriching the implicit model that is exposed to the web view.
> 
> [Original] * `org.springframework.web.servlet.mvc.support.RedirectAttributes` to specify the exact set of attributes to use in case of a redirect and also to add flash attributes (attributes stored temporarily on the server-side to make them available to the request after the redirect). See [the section called "Passing Data To the Redirect Target"](mvc.html#mvc-redirecting-passing-data "Passing Data To the Redirect Target" ) and [Section 21.6, "Using flash attributes"](mvc.html#mvc-flash-attributes "21.6 Using flash attributes" ).


* 带`@RequestBody`注解的参数，提供了对HTTP请求体的存取。参数的值通过`HttpMessageConverter`被转换成方法参数所声明的类型。详见[“使用@RequestBody注解映射请求体”一节"](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestbody "Mapping the request body with the @RequestBody annotation" )
* 带`@RequestPart`注解的参数，提供了对一个"multipart/form-data请求块（request part）内容的存取。更多的信息请参考[21.10.5 “处理客户端文件上传的请求”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-multipart-forms-non-browsers "21.10.5 Handling a file upload request from programmatic clients")和[21.10 “Spring对多部分文件上传的支持”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-multipart "21.10 Spring's multipart \(file upload\) support")
* `HttpEntity<?>`类型的参数，其提供了对HTTP请求头和请求内容的存取。请求流是通过`HttpMessageConverter`被转换成entity对象的。详见[“HttpEntity”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-httpentity "Using HttpEntity")
* `java.util.Map`/`org.springframework.io.Model`/`org.springframework.ui.ModelMap`类型的参数，用以增强默认暴露给视图层的模型(model)的功能
* `org.springframework.web.servlet.mvc.support.RedirectAttributes`类型的参数，用以指定重定向下要使用到的属性集以及添加flash属性（暂存在服务端的属性，它们会在下次重定向请求的范围中有效）。详见[“向重定向请求传递参数”一节](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-flash-attributes "21.6 Using flash attributes")


> [Original] * Command or form objects to bind request parameters to bean properties (via setters) or directly to fields, with customizable type conversion, depending on `@InitBinder` methods and/or the HandlerAdapter configuration. See the `webBindingInitializer` property on `RequestMappingHandlerAdapter`. Such command objects along with their validation results will be exposed as model attributes by default, using the command class class name - e.g. model attribute "orderAddress" for a command object of type "some.package.OrderAddress". The `ModelAttribute` annotation can be used on a method argument to customize the model attribute name used.
> 
> [Original] * `org.springframework.validation.Errors` / `org.springframework.validation.BindingResult` validation results for a preceding command or form object (the immediately preceding method argument).
> 
> [Original] * `org.springframework.web.bind.support.SessionStatus` status handle for marking form processing as complete, which triggers the cleanup of session attributes that have been indicated by the `@SessionAttributes` annotation at the handler type level.
> 
> [Original] * `org.springframework.web.util.UriComponentsBuilder` a builder for preparing a URL relative to the current request's host, port, scheme, context path, and the literal part of the servlet mapping.

* 命令或表单对象，它们用于将请求参数直接绑定到bean字段（可能是通过setter方法）。你可以通过`@InitBinder`注解和/或`HanderAdapter`的配置来定制这个过程的类型转换。具体请参考`RequestMappingHandlerAdapter`类`webBindingInitializer`属性的文档。这样的命令对象，以及其上的验证结果，默认会被添加到模型model中，键名默认是该命令对象类的类名——比如，`some.package.OrderAddress`类型的命令对象就使用属性名`orderAddress`类获取。`ModelAttribute`注解可以应用在方法参数上，用以指定该模型所用的属性名
* `org.springframework.validation.Errors` / `org.springframework.validation.BindingResult`验证结果对象，用于存储前面的命令或表单对象的验证结果（紧接其前的第一个方法参数）。
* `org.springframework.web.bind.support.SessionStatus`对象，用以标记当前的表单处理已结束。这将触发一些清理操作：`@SessionAttributes`在类级别注解的属性将被移除
* `org.springframework.web.util.UriComponentsBuilder`构造器对象，用于构造当前请求URL相关的信息，比如主机名、端口号、资源类型（scheme）、上下文路径、servlet映射中的相对部分（literal part）等

> The `Errors` or `BindingResult` parameters have to follow the model object
that is being bound immediately as the method signature might have more than
one model object and Spring will create a separate `BindingResult` instance
for each of them so the following sample won't work:

在参数列表中，`Errors`或`BindingResult`参数必须紧跟在其所绑定的验证对象后面。这是因为，在参数列表中允许有多于一个的模型对象，Spring会为它们创建不同的`BindingResult`实例。因此，下面这样的代码是不能工作的：

> __Invalid ordering of BindingResult and @ModelAttribute.__
```java
_@RequestMapping(method = RequestMethod.POST)_
public String processSubmit(@ModelAttribute("pet") Pet pet, Model model, BindingResult result) { ... }
```

__BindingResult与@ModelAttribute错误的参数次序__
```java
@RequestMapping(method = RequestMethod.POST)
public String processSubmit(@ModelAttribute("pet") Pet pet, Model model, BindingResult result) { ... }
```

> Note, that there is a `Model` parameter in between `Pet` and `BindingResult`.
To get this working you have to reorder the parameters as follows:

```java
_@RequestMapping(method = RequestMethod.POST)_
public String processSubmit(@ModelAttribute("pet") Pet pet, BindingResult result, Model model) { ... }
```

上例中，因为在模型对象`Pet`和验证结果对象`BindingResult`中间还插了一个`Model`参数，这是不行的。要达到预期的效果，必须调整一下参数的次序：

```java
@RequestMapping(method = RequestMethod.POST)
public String processSubmit(@ModelAttribute("pet") Pet pet, BindingResult result, Model model) { ... }
```













> [Original] 