# 21.2.2 默认的DispatcherServlet配置

上一小节讲到，`DispatcherServlet`维护了一个列表，其中保存了其所依赖的所有bean的默认实现。这个列表保存在包`org.springframework.web.servlet`下的`DispatcherServlet.properties`文件中。

这些特殊的bean都有一些基本的默认行为。或早或晚，你可能需要对它们提供的一些默认配置进行定制。比如说，通常你需要配置`InternalResourceViewResolver`类提供的`prefix`属性，使其指向视图文件所在的目录。

这里需要理解的一个事情是，一旦你在web应用上下文`WebApplicationContext`中配置了某个特殊bean以后（比如`InternalResourceViewResolver`），实际上你也覆写了该bean的默认实现。比方说，如果你配置了`InternalResourceViewResolver`，那么框架就不会再使用bean`ViewResolver`的默认实现。

在[21.16节 Spring MVC的配置](../21-16/configuring-spring-mvc.md)中，我们介绍了其他配置Spring MVC的方式，比如通过Java编程配置或者通过MVC XML命名空间进行配置。它们为配置一个Spring MVC应用提供了简易的开始方式，也不需要你对框架实现细节有太多了解。当然，无论你选用何种方式开始配置，本节所介绍的一些概念都是基础且普适的，它们对你后续的学习都应有所助益。
