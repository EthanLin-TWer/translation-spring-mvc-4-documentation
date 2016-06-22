# 21.13.1 控制器类名-处理器映射ControllerClassNameHandlerMapping

`ControllerClassNameHandlerMapping`类是`HandlerMapping`接口的一个实现，它是通过一个约定来解析请求URL及处理该请求的`@Controller`控制器实例之间的映射关系。

请看下面一个简单的控制器实现。请注意留意该类的 _名称_：

```java
public class **ViewShoppingCartController** implements Controller {

    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) {
        // 这个例子中方法的具体实现并不重要，故忽略。
    }

}
```

对应的Spring Web MVC配置文件如下所示：

```xml
<bean class="org.springframework.web.servlet.mvc.support.ControllerClassNameHandlerMapping"/>

<bean id="**viewShoppingCart**" class="x.y.z.ViewShoppingCartController">
    <!-- 注入需要的依赖 -->
</bean>
```

`ControllerClassNameHandlerMapping`会查找当前应用上下文中注册的所有处理器（也即控制器）bean，并去除类名的`Controller`后缀作为决定处理器映射的依据。因此，类名`ViewShoppingCartController`会被映射到匹配`/viewshoppingcart*`的请求URL上。

让我们多看几个例子，这样你对于核心的思想会马上熟悉起来（注意URL中路径是全小写，而`Controller`控制器类名符合驼峰命名法）：

* `WelcomeController`将映射到`/welcome*`请求URL
* `HomeController` 将映射到`/home*`请求URL
* `IndexController` 将映射到`/index*`请求URL
* `RegisterController` 将映射到`/register*`请求URL

对于`MultiActionController`处理器类，映射规则要稍微复杂一些。请看下面的代码，假设这里的控制器都是`MultiActionController`的实现：

* `AdminController`将映射到`/admin/*`请求URL
* `CatalogController`将映射到`/catalog/*`请求URL

只要所有控制器`Controller`实现都遵循`xxxController`这样的命名规范，那么`ControllerClassNameHandlerMapping`能把你从定义维护一个 _长长长_ `SimpleUrlHandlerMapping`映射表的重复工作中拯救出来。

`ControllerClassNameHandlerMapping`类继承自 `AbstractHandlerMapping`基类。因此，你可以视它与其他`HandlerMapping`实现一样，定义你所需要的拦截器`HandlerInterceptor`实例及其他所有东西。
