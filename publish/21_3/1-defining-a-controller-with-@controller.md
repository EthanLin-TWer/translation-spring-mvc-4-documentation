# 21.3.1 使用@Controller注解定义一个控制器

> [Original] The @Controller annotation indicates that a particular class serves the role of a controller. Spring does not require you to extend any controller base class or reference the Servlet API. However, you can still reference Servlet-specific features if you need to.

> [Original] The @Controller annotation acts as a stereotype for the annotated class, indicating its role. The dispatcher scans such annotated classes for mapped methods and detects @RequestMapping annotations (see the next section).

> [Original] You can define annotated controller beans explicitly, using a standard Spring bean definition in the dispatcher’s context. However, the @Controller stereotype also allows for autodetection, aligned with Spring general support for detecting component classes in the classpath and auto-registering bean definitions for them.

> [Original] To enable autodetection of such annotated controllers, you add component scanning to your configuration. Use the spring-context schema as shown in the following XML snippet:
