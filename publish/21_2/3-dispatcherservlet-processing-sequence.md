# 21.2.3 DispatcherServlet的处理流程

> After you set up a `DispatcherServlet`, and a request comes in for that specific `DispatcherServlet`, the `DispatcherServlet` starts processing the request as follows:

配置好`DispatcherServlet`以后，当有请求经过这个`DispatcherServlet`的时候，`DispatcherServlet`会开始对其进行处理，次序如下：

> * The `WebApplicationContext` is searched for and bound in the request as an attribute that the controller and other elements in the process can use. It is bound by default under the key `DispatcherServlet.WEB_APPLICATION_CONTEXT_ATTRIBUTE`.
> * The locale resolver is bound to the request to enable elements in the process to resolve the locale to use when processing the request (rendering the view, preparing data, and so on). If you do not need locale resolving, you do not need it.
> * The theme resolver is bound to the request to let elements such as views determine which theme to use. If you do not use themes, you can ignore it.
> * If you specify a multipart file resolver, the request is inspected for multiparts; if multiparts are found, the request is wrapped in a `MultipartHttpServletRequest` for further processing by other elements in the process. See Section 21.10, “Spring’s multipart (file upload) support” for further information about multipart handling.
> * An appropriate handler is searched for. If a handler is found, the execution chain associated with the handler (preprocessors, postprocessors, and controllers) is executed in order to prepare a model or rendering.
> * If a model is returned, the view is rendered. If no model is returned, (may be due to a preprocessor or postprocessor intercepting the request, perhaps for security reasons), no view is rendered, because the request could already have been fulfilled.

* 首先，搜索应用的上下文对象`WebApplicationContext`并把它作为请求的一个属性（attribute）绑定到请求上，以便控制器controller和其他处理组件可以使用。上下文对象默认以键名`DispatcherServlet.WEB_APPLICATION_CONTEXT_ATTRIBUTE`被绑定到请求上
* 将区域解析器（locale resolver）绑定到请求上，以便其他组件在处理请求（渲染视图、准备数据等）的过程中可以获取区域相关的信息。如果你的应用不需要解析区域相关的信息，那么你不需要进行特别的配置
* 将主题解析器（theme resolver）绑定到请求上，以便其他组件，比如视图等，能够了解要渲染哪个主题文件。同样，如果你不需要使用主题相关的特性，你可以忽略这个部分
* 如果你在应用中配置了其他的multipart文件处理器，那么框架将查找该文件是不是分多次传输的。若是，则该请求将被包装成一个多路请求对象`MultipartHttpServletRequest`，以便处理链中的其他组件对它进行进一步的处理。关于Spring对multipart文件传输处理的更多信息，读者可以参考第21.10节（Spring的多路（文件上传）支持）
* 为该请求查找一个合适的处理器。如果可以找到对应的处理器，则与该处理器相关的整条执行链（前处理器、后处理器、控制器controller等）都会依次执行，以准备相应的模型（model）和视图可供渲染（view）
* 如果返回的是一个模型（model），那么相应的视图将会被渲染。若返回的不是一个模型（可能是因为前后的处理器因为某些安全的原因拦截了请求等），则没有视图会被渲染，因为，请求可能已经被fulfilled了（待选词）

> Handler exception resolvers that are declared in the `WebApplicationContext` pick up exceptions that are thrown during processing of the request. Using these exception resolvers allows you to define custom behaviors to address exceptions.

如果请求的处理过程抛出了异常，那么上下文`WebApplicationContext`对象中定义的异常处理器将会负责捕获它们。通过配置你自己的异常处理器，你可以定制自己处理异常的方式。

> The Spring `DispatcherServlet` also supports the return of the _last-modification-date_, as specified by the Servlet API. The process of determining the last modification date for a specific request is straightforward: the `DispatcherServlet` looks up an appropriate handler mapping and tests whether the handler that is found implements the _LastModified_ interface. If so, the value of the `long getLastModified(request)` method of the `LastModified` interface is returned to the client.

Spring的`DispatcherServlet`同时也支持返回Servlet API规范中所定义的_最后修改时间戳（last-modification-date）_值。处理最后修改时间的方式很直接：`DispatcherServlet`会查找映射表来找到请求对应的处理器，检测它是否实现了_LastModified_接口。若是，则调用接口的`long getLastModified(request)`方法，并将方法的返回值返回给客户端。

> You can customize individual `DispatcherServlet` instances by adding Servlet initialization parameters (`init-param` elements) to the Servlet declaration in the `web.xml` file. See the following table for the list of supported parameters.

你可以在servlet的定义文件`web.xml`文件中添加一些servlet的初始化参数（比如`init-param`等）来定制不同的`DispatcherServlet`实例。可选的参数请见下表：

> | Parameter | Explanation |
> | :-- | :-- |
> | `contextClass` | Class that implements `WebApplicationContext`, which instantiates the context used by this Servlet. By default, the `XmlWebApplicationContext` is used. |
> | `contextConfigLocation` | String that is passed to the context instance (specified by `contextClass`) to indicate where context(s) can be found. The string consists potentially of multiple strings (using a comma as a delimiter) to support multiple contexts. In case of multiple context locations with beans that are defined twice, the latest location takes precedence. |
> | `namespace` | Namespace of the `WebApplicationContext`. Defaults to `[servlet-name]-servlet`. |


