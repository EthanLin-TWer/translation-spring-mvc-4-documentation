# 21.2.2 默认的DispatcherServlet配置

上一小节讲到，`DispatcherServlet`维护了一个列表，其中保存了其所依赖的所有bean的默认实现。这个列表保存在包`org.springframework.web.servlet`下的`DispatcherServlet.properties`文件中。

这些特殊的bean都有一些基本的默认行为。或早或晚，你可能需要对它们提供的一些默认配置进行定制。比如说，通常你需要配置`InternalResourceViewResolver`类提供的`prefix`属性，使其指向视图文件所在的目录。

> Regardless of the details, the important concept to understand here is that once you configure a special bean such as an InternalResourceViewResolver in your WebApplicationContext, you effectively override the list of default implementations that would have been used otherwise for that special bean type. For example if you configure an InternalResourceViewResolver, the default list of ViewResolver implementations is ignored.

需要了解的是，一旦你在web的上下文`WebApplicationContext`中配置了某个特定的bean之后（比如`InternalResourceViewResolver`），该bean的默认实现就被覆盖了。比方说，如果你配置了`InternalResourceViewResolver`，那么bean`ViewResolver`的默认实现就会被框架忽略。

> In Section 21.16, “Configuring Spring MVC” you’ll learn about other options for configuring Spring MVC including MVC Java config and the MVC XML namespace both of which provide a simple starting point and assume little knowledge of how Spring MVC works. Regardless of how you choose to configure your application, the concepts explained in this section are fundamental should be of help to you.

在21.16节“Spring MVC的配置”中，你可以了解到对Spring MVC进行配置的其他方式，比如通过Java编程的配置或者通过MVC的xml命名空间进行的配置。它们都是学习Spring MVC很好的切入点，也不需要你了解框架太多的实现细节。当然，无论你选用何种方式，本节所介绍的一些基本概念都是适用的。希望它们能对你后续的学习有所帮助。
