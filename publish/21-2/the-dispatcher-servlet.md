# 21.2 DispatcherServlet

Spring MVC框架，与其他很多web的MVC框架一样：请求驱动；所有设计都围绕着一个中央Servlet来展开，它负责把所有请求分发到控制器；同时提供其他web应用开发所需要的功能。不过Spring的中央处理器，`DispatcherServlet`，能做的比这更多。它与Spring IoC容器做到了无缝集成，这意味着，Spring提供的任何特性，在Spring MVC中你都可以使用。

下图展示了Spring Web MVC的`DispatcherServlet`处理请求的工作流。熟悉设计模式的朋友会发现，`DispatcherServlet`应用的其实就是一个“前端控制器”的设计模式（其他很多优秀的web框架也都使用了这个设计模式）。

![图21.1 Spring Web MVC处理请求的（高层抽象）工作流](./figures/figure-21-1-the-request-processing-workflow-in-spring-web-mvc.png)

`DispatcherServlet`其实就是个`Servlet`（它继承自`HttpServlet`基类），同样也需要在你web应用的`web.xml`配置文件下声明。你需要在`web.xml`文件中把你希望`DispatcherServlet`处理的请求映射到对应的URL上去。这就是标准的Java EE Servlet配置；下面的代码就展示了对`DispatcherServlet`和路径映射的声明：

```xml
<web-app>
    <servlet>
        <servlet-name>example</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>example</servlet-name>
        <url-pattern>/example/*</url-pattern>
    </servlet-mapping>
</web-app>
```

> In the preceding example, all requests starting with `/example` will be handled by the `DispatcherServlet` instance named example. In a Servlet 3.0+ environment, you also have the option of configuring the Servlet container programmatically. Below is the code based equivalent of the above web.xml example:

在上面的例子中，所有路径以`/example`开头的请求都会被名字为`example`的`DispatcherServlet`处理。在Servlet 3.0+的环境下，你还可以用编程的方式配置Servlet容器。下面是一段这种基于代码配置的例子，它与上面定义的`web.xml`配置文件是等效的。

```java
public class MyWebApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext container) {
        ServletRegistration.Dynamic registration = container.addServlet("dispatcher", new DispatcherServlet());
        registration.setLoadOnStartup(1);
        registration.addMapping("/example/*");
    }

}
```

`WebApplicationInitializer`是Spring MVC提供的一个接口，它会查找你所有基于代码的配置，并应用它们来初始化Servlet 3版本以上的web容器。它有一个抽象的实现`AbstractDispatcherServletInitializer`，用以简化`DispatcherServlet`的注册工作：你只需要指定其servlet映射（mapping）即可。若想了解更多细节，可以参考[基于代码的Servlet容器初始化](../21-15/code-based-servlet-container-initialization.md)一节。


上面只是配置Spring Web MVC的第一步，接下来你需要配置其他的一些bean（除了`DispatcherServlet`以外的其他bean），它们也会被Spring Web MVC框架使用到。

在[6.15 应用上下文ApplicationContext的其他作用)](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/beans.html#context-introduction)一节中我们聊到，Spring中的`ApplicationContext`实例是可以有范围（scope）的。在Spring MVC中，每个`DispatcherServlet`都持有一个自己的上下文对象`WebApplicationContext`，它又继承了根（root）`WebApplicationContext`对象中已经定义的所有bean。这些继承的bean可以在具体的Servlet实例中被重载，在每个Servlet实例中你也可以定义其scope下的新bean。

![图21.2 Spring Web MVC中常见的context层级结构](./figures/figure-21-2-typical-context-hierarchy-in-spring-web-mvc.png)

`DispatcherServlet`的初始化过程中，Spring MVC会在你web应用的`WEB-INF`目录下查找一个名为[servlet-name]-servlet.xml的配置文件，并创建其中所定义的bean。如果在全局上下文中存在相同名字的bean，则它们将被新定义的同名bean覆盖。

看看下面这个`DispatcherServlet`的Servlet配置（定义于web.xml文件中）：

```xml
<web-app>
    <servlet>
        <servlet-name>golfing</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>golfing</servlet-name>
        <url-pattern>/golfing/*</url-pattern>
    </servlet-mapping>
</web-app>
```

有了以上的Servlet配置文件，你还需要在应用中的`/WEB-INF/`路径下创建一个`golfing-servlet.xml`文件，在该文件中定义所有Spring MVC相关的组件（比如bean等）。你可以通过servlet初始化参数为这个配置文件指定其他的路径（见下面的例子）：

你也可以改变这个配置文件所在的目录。。。

当你的应用中只需要一个`DispatcherServlet`时，只配置一个根context对象也是可行的。

![图21.3 Spring Web MVC中的根context](./figures/figure-21-3-single-root-context-in-spring-web-mvc.png)

要配置一个唯一的根context对象，可以通过在servlet初始化参数中配置一个空的contextConfigLocation来做到，如下所示：

```xml
<web-app>
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/root-context.xml</param-value>
    </context-param>
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value></param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/*</url-pattern>
    </servlet-mapping>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
</web-app>
```

`WebApplicationContext`继承自`ApplicationContext`，它提供了一些web应用经常需要用到的特性。它与普通的`ApplicationContext`不同的地方在于，它支持主题的解析（详见[21.9 主题Themes](../21-9/using-themes.md)一小节），并且知道它关联到的是哪个servlet（它持有一个该`ServletContext`的引用）。`WebApplicationContext`被绑定在`ServletContext`中。如果需要获取它，你可以通过`RequestContextUtils`工具类中的静态方法来拿到这个web应用的上下文`WebApplicationContext`。
