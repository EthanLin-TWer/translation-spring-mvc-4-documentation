# 21.3.1 使用@Controller注解定义一个控制器

> [Original] The `@Controller` annotation indicates that a particular class serves the role of a controller. Spring does not require you to extend any controller base class or reference the Servlet API. However, you can still reference Servlet-specific features if you need to.

`@Controller`注解表明了一个类是作为控制器的角色而存在的。Spring不要求你去继承任何控制器基类，也不要求你去实现Servlet的那套API。当然，如果你需要的话也可以去使用任何与Servlet相关的特性和设施。

> [Original] The `@Controller` annotation acts as a stereotype for the annotated class, indicating its role. The dispatcher scans such annotated classes for mapped methods and detects `@RequestMapping` annotations (see the next section).

`@Controller`注解可以认为是被标注类的原型（stereotype），表明了这个类所承担的角色。分派器（`DispatcherServlet`）会扫描所有注解了`@Controller`的类，检测其中通过`@RequestMapping`注解配置的方法（详见下一小节）。

> [Original] You can define annotated controller beans explicitly, using a standard Spring bean definition in the dispatcher’s context. However, the `@Controller` stereotype also allows for autodetection, aligned with Spring general support for detecting component classes in the classpath and auto-registering bean definitions for them.

当然，你也可以不使用`@Controller`注解而显式地去定义被注解的bean，这点通过标准的Spring bean的定义方式，在dispather的上下文属性下配置即可做到。但是`@Controller`原型是可以被框架自动检测的，Spring支持classpath路径下组件类的自动检测，以及对已定义bean的自动注册。

> [Original] To enable autodetection of such annotated controllers, you add component scanning to your configuration. Use the spring-context schema as shown in the following XML snippet:

你需要在配置中加入组件扫描的配置代码来开启框架对注解控制器的自动检测。请使用下面XML代码所示的spring-context schema：








