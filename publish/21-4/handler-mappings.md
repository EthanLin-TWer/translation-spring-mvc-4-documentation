# 21.4 处理器映射（Handler Mappings）

在Spring的上个版本中，用户需要在web应用的上下文中定义一个或多个的`HandlerMapping`bean，用以将进入容器的web请求映射到合适的处理器方法上。允许在控制器上添加注解后，通常你就不必这么做了，因为`RequestMappingHandlerMapping`类会自动查找所有注解了`@RequestMapping`的`@Controller`控制器bean。同时也请知道，所有继承自`AbstractHandlerMapping`的处理器方法映射`HandlerMapping`类都拥有下列的属性，你可以对它们进行定制：

* 一个`interceptors`列表，指示了应用其上的一个拦截器列表。处理器方法拦截器会在 [21.4.1小节 使用HandlerInterceptor拦截请求](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-handlermapping-interceptor "21.4.1 Intercepting requests with a HandlerInterceptor")中讨论。
* `defaultHandler`，生效的默认处理器，when this handler mapping does not result in a matching handler.
* `order`，根据order（见`org.springframework.core.Ordered`接口）属性的值，Spring会对上下文可用的所有处理器映射进行排序，并应用第一个匹配成功的处理器
* `alwaysUseFullPath`（总是使用完整路径）。若设置为`true`，Spring将在当前Servlet上下文中总是使用完整路径来查找合适的处理器。若设置为`false`（默认就为`false`），则使用当前Servlet的mapping路径。举个例子，若一个Servlet的mapping路径是`/testing/*`，并且`alwaysUseFullPath`属性被设置为`true`，此时用于查找处理器的路径将是`/testing/viewPage.html`；而若`alwaysUseFullPath`属性的值为`false`，则此时查找路径是`/viewPage.html`
* `urlDecode`，默认设置为`true`（也是Spring 2.5的默认设置）。若你需要比较加密过的路径，则把此标志设为`false`。需要注意的是，`HttpServletRequest`永远以未加密的方式存储Servlet路径。此时，该路径将无法匹配到加密过的路径

下面的代码展示了配置一个拦截器的方法：

```xml
<beans>
    <bean id="handlerMapping" class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping">
        <property name="interceptors">
            <bean class="example.MyInterceptor"/>
        </property>
    </bean>
<beans>
```
