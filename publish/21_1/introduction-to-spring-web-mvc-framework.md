# 21.1 Spring Web MVC框架简介

> The Spring Web model-view-controller (MVC) framework is designed around a DispatcherServlet that dispatches requests to handlers, with configurable handler mappings, view resolution, locale, time zone and theme resolution as well as support for uploading files. The default handler is based on the @Controller and @RequestMapping annotations, offering a wide range of flexible handling methods. With the introduction of Spring 3.0, the @Controller mechanism also allows you to create RESTful Web sites and applications, through the @PathVariable annotation and other features.

Spring的模型-视图-控制器（MVC）框架是围绕一个`DispatcherServlet`来设计的，这个类会把请求分发到各个处理器（handlers）上，同时允许更改其他的配置，比如处理器路径映射、视图渲染、本地化、时区与主题渲染等，甚至还能支持文件上传。默认的处理器是根据你所应用的`@Controller`和`@RequestMapping`注解来进行配置的，可以支持多种类型处理器方法的灵活的配置。引进了Spring 3.0的`@PathVariable`注解以及一些其他的特性后，`@Controller`注解还能支持RESTful的Web站点和应用程序的开发。

> "Open for extension…​" A key design principle in Spring Web MVC and in Spring in general is the "Open for extension, closed for modification" principle.

“对扩展开放”是Spring Web MVC框架的一个重要设计原则，而对于Spring的整个完整框架来说，其设计原则则是“对扩展开放，对修改闭合”。

> Some methods in the core classes of Spring Web MVC are marked final. As a developer you cannot override these methods to supply your own behavior. This has not been done arbitrarily, but specifically with this principle in mind.

Spring Web MVC核心类库中的一些方法被定义成`final`的。作为开发人员，你不能覆写这些方法以获取自己期望的行为。当然，也不是说绝对不行，但要知道绝大多数情况下是不行的。

> For an explanation of this principle, refer to Expert Spring Web MVC and Web Flow by Seth Ladd and others; specifically see the section "A Look At Design," on page 117 of the first edition. Alternatively, see

如果想了解更多关于这条（“对扩展开放”）原则的信息，你可以参考Seth Ladd等人所著的“深入解析Spring Web MVC与Web Flow”一书。相关信息在第117页，“设计初探（A Look At Design）”一节。或者，你可以参考：

> Bob Martin, The Open-Closed Principle (PDF)
> You cannot add advice to final methods when you use Spring MVC. For example, you cannot add advice to the AbstractController.setSynchronizeOnSession() method. Refer to Section 10.6.1, “Understanding AOP proxies” for more information on AOP proxies and why you cannot add advice to final methods.

Bob Martin所写的“开闭原则（The Open-Closed Principle）”（是个pdf版本）。你无法定制Spring MVC中的`final`方法，比如`AbstractController.setSynchronizeOnSession()`方法等。请参考10.6.1“理解AOP代理”一节，其中论述了AOP代理的相关知识，解释了你不应该尝试自己定制`final`方法的理由。

> In Spring Web MVC you can use any object as a command or form-backing object; you do not need to implement a framework-specific interface or base class. Spring’s data binding is highly flexible: for example, it treats type mismatches as validation errors that can be evaluated by the application, not as system errors. Thus you need not duplicate your business objects' properties as simple, untyped strings in your form objects simply to handle invalid submissions, or to convert the Strings properly. Instead, it is often preferable to bind directly to your business objects.

在Spring Web MVC中，你可以使用任何对象来作为命令对象或者表单后退对象等。你无须另外实现一个框架提供的特定接口或基类。Spring的数据绑定机制非常灵活，比如，它会把不匹配的数据类型当成程序运行时的验证错误，而非系统错误。你可能会为了避免非法的类型转换在表单对象中使用字符串来存储数据，但简单的字符串无法描述业务数据的真正类型，并且你还需要把它们转换成对应的业务对象类型。有了Spring的验证机制，意味着你再也不需这么做了，而且直接把表单对象绑定到业务对象通常会是更好的选择。

> Spring’s view resolution is extremely flexible. A Controller is typically responsible for preparing a model Map with data and selecting a view name but it can also write directly to the response stream and complete the request. View name resolution is highly configurable through file extension or Accept header content type negotiation, through bean names, a properties file, or even a custom ViewResolver implementation. The model (the M in MVC) is a Map interface, which allows for the complete abstraction of the view technology. You can integrate directly with template based rendering technologies such as JSP, Velocity and Freemarker, or directly generate XML, JSON, Atom, and many other types of content. The model Map is simply transformed into an appropriate format, such as JSP request attributes, a Velocity template model.

Spring的视图解析更是设计得灵活异常。控制器一般负责准备一个`Map`模型并将数据填充进去、选择一个合适的视图名等，但控制器也可以选择直接将数据写到响应流中。视图名的解析高度灵活，支持多种配置，包括通过文件扩展名、`Accept`内容头、bean、配置文件等来配置，甚至你还可以自己实现一个视图解释器`ViewResolver`。MVC中'M'部分所指的模型其实是一个`Map`类型的接口，彻底地把数据从视图技术中分离了出来。你可以直接整合起基于模板的渲染技术，如JSP、Velocity和Freemarker等，或者，你还可以直接生成XML、JSON、Atom以及其他多种类型的内容。`Map`模型将会简单地被转换成合适的格式，比如JSP的请求属性（attribute）或者一个Velocity模板的模型等。
