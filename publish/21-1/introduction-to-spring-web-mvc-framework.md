# 21.1 Spring Web MVC框架简介

Spring的模型-视图-控制器（MVC）框架是围绕一个`DispatcherServlet`来设计的，这个Servlet会把请求分发给各个处理器，并支持可配置的处理器映射、视图渲染、本地化、时区与主题渲染等，甚至还能支持文件上传。处理器是你的应用中注解了`@Controller`和`@RequestMapping`的类和方法，Spring为处理器方法提供了极其多样灵活的配置。Spring 3.0以后提供了`@Controller`注解机制、`@PathVariable`注解以及一些其他的特性，你可以使用它们来进行RESTful web站点和应用的开发。

> “对扩展开放”是Spring Web MVC框架一个重要的设计原则，而对于Spring的整个完整框架来说，其设计原则则是“对扩展开放，对修改闭合”。
>
> Spring Web MVC核心类库中的一些方法被定义为`final`方法。作为开发人员，你不能覆写这些方法以定制其行为。当然，不是说绝对不行，但请记住这条原则，绝大多数情况下不是好的实践。
>
> 关于该原则的详细解释，你可以参考Seth Ladd等人所著的“深入解析Spring Web MVC与Web Flow”一书。相关信息在第117页，“设计初探（A Look At Design）”一节。或者，你可以参考：
>
> * [Bob Martin所写的“开闭原则（The Open-Closed Principle）”（PDF）](http://www.objectmentor.com/resources/articles/ocp.pdf)
>
> 你无法增强Spring MVC中的`final`方法，比如`AbstractController.setSynchronizeOnSession()`方法等。请参考[10.6.1 理解AOP代理](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/aop.html#aop-understanding-aop-proxies)一节，其中解释了AOP代理的相关知识，论述了为什么你不能对`final`方法进行增强。

在Spring Web MVC中，你可以使用任何对象来作为命令对象或表单返回对象，而无须实现一个框架相关的接口或基类。Spring的数据绑定非常灵活：比如，它会把数据类型不匹配当成可由应用自行处理的运行时验证错误，而非系统错误。你可能会为了避免非法的类型转换在表单对象中使用字符串来存储数据，但无类型的字符串无法描述业务数据的真正含义，并且你还需要把它们转换成对应的业务对象类型。有了Spring的验证机制，意味着你再也不需这么做了，并且直接将业务对象绑定到表单对象上通常是更好的选择。

Spring的视图解析也是设计得异常灵活。控制器一般负责准备一个`Map`模型、填充数据、返回一个合适的视图名等，同时它也可以直接将数据写到响应流中。视图名的解析高度灵活，支持多种配置，包括通过文件扩展名、`Accept`内容头、bean、配置文件等的配置，甚至你还可以自己实现一个视图解析器`ViewResolver`。模型（MVC中的M，model）其实是一个`Map`类型的接口，彻底地把数据从视图技术中抽象分离了出来。你可以与基于模板的渲染技术直接整合，如JSP、Velocity和Freemarker等，或者你还可以直接生成XML、JSON、Atom以及其他多种类型的内容。`Map`模型会简单地被转换成合适的格式，比如JSP的请求属性（attribute），一个Velocity模板的模型等。
