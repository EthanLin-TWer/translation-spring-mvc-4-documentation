# 21.2.3 DispatcherServlet的处理流程

配置好`DispatcherServlet`以后，开始有请求会经过这个`DispatcherServlet`。此时，`DispatcherServlet`会依照以下的次序对请求进行处理：

* 首先，搜索应用的上下文对象`WebApplicationContext`并把它作为一个属性（attribute）绑定到该请求上，以便控制器和其他组件能够使用它。属性的键名默认为`DispatcherServlet.WEB_APPLICATION_CONTEXT_ATTRIBUTE`
* 将地区（locale）解析器绑定到请求上，以便其他组件在处理请求（渲染视图、准备数据等）时可以获取区域相关的信息。如果你的应用不需要解析区域相关的信息，忽略它即可
* 将主题（theme）解析器绑定到请求上，以便其他组件（比如视图等）能够了解要渲染哪个主题文件。同样，如果你不需要使用主题相关的特性，忽略它即可
* 如果你配置了multipart文件处理器，那么框架将查找该文件是不是multipart（分为多个部分连续上传）的。若是，则将该请求包装成一个`MultipartHttpServletRequest`对象，以便处理链中的其他组件对它做进一步的处理。关于Spring对multipart文件传输处理的支持，读者可以参考[21.10 Spring的multipart（文件上传）支持](../21-10/springs-multipart-file-upload-support.md)一小节
* 为该请求查找一个合适的处理器。如果可以找到对应的处理器，则与该处理器关联的整条执行链（前处理器、后处理器、控制器等）都会被执行，以完成相应模型的准备或视图的渲染
* 如果处理器返回的是一个模型（model），那么框架将渲染相应的视图。若没有返回任何模型（可能是因为前后的处理器出于某些原因拦截了请求等，比如，安全问题），则框架不会渲染任何视图，此时认为对请求的处理可能已经由处理链完成了

如果在处理请求的过程中抛出了异常，那么上下文`WebApplicationContext`对象中所定义的异常处理器将会负责捕获这些异常。通过配置你自己的异常处理器，你可以定制自己处理异常的方式。

Spring的`DispatcherServlet`也允许处理器返回一个Servlet API规范中定义的 _最后修改时间戳（last-modification-date）_ 值。决定请求最后修改时间的方式很直接：`DispatcherServlet`会先查找合适的处理器映射来找到请求对应的处理器，然后检测它是否实现了 _LastModified_ 接口。若是，则调用接口的`long getLastModified(request)`方法，并将该返回值返回给客户端。

你可以定制`DispatcherServlet`的配置，具体的做法，是在`web.xml`文件中，Servlet的声明元素上添加一些Servlet的初始化参数（通过`init-param`元素）。该元素可选的参数列表如下：

| 可选参数 | 解释 |
| :-- | :-- |
| `contextClass` | 任意实现了`WebApplicationContext`接口的类。这个类会初始化该servlet所需要用到的上下文对象。默认情况下，框架会使用一个`XmlWebApplicationContext`对象。 |
| `contextConfigLocation` | 一个指定了上下文配置文件路径的字符串，该值会被传入给`contextClass`所指定的上下文实例对象。该字符串内可以包含多个字符串，字符串之间以逗号分隔，以此支持你进行多个上下文的配置。在多个上下文中重复定义的bean，以最后加载的bean定义为准 |
| `namespace` | `WebApplicationContext`的命名空间。默认是`[servlet-name]-servlet` |  
