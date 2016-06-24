# 21.15 基于代码的Servlet容器初始化

在Servlet 3.0以上的环境相爱，你可以通过编程的方式来配置Servlet容器了。你可以完全放弃`web.xml`，也可以两种配置方式同时使用。以下是一个注册`DispatcherServlet`的例子：

```java
import org.springframework.web.WebApplicationInitializer;

public class MyWebApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext container) {
        XmlWebApplicationContext appContext = new XmlWebApplicationContext();
        appContext.setConfigLocation("/WEB-INF/spring/dispatcher-config.xml");

        ServletRegistration.Dynamic registration = container.addServlet("dispatcher", new DispatcherServlet(appContext));
        registration.setLoadOnStartup(1);
        registration.addMapping("/");
    }

}
```

Spring MVC提供了一个`WebApplicationInitializer`接口，实现这个接口能保证你的配置能自动被检测到并应用于Servlet 3容器的初始化中。`WebApplicationInitializer`有一个实现，是一个抽象的基类，名字叫`AbstractDispatcherServletInitializer`。有了它，要配置`DispatcherServlet`将变得更简单，你只需要覆写相应的方法，在其中提供servlet映射、`DispatcherServlet`所需配置的位置即可：

```java
public class MyWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return null;
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] { MyWebConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }

}
```

以上的例子适用于使用基于Java配置的Spring应用。如果你使用的是基于XML的Spring配置方式，那么请直接继承`AbstractDispatcherServletInitializer`这个类：

```java
public class MyWebAppInitializer extends AbstractDispatcherServletInitializer {

    @Override
    protected WebApplicationContext createRootApplicationContext() {
        return null;
    }

    @Override
    protected WebApplicationContext createServletApplicationContext() {
        XmlWebApplicationContext cxt = new XmlWebApplicationContext();
        cxt.setConfigLocation("/WEB-INF/spring/dispatcher-config.xml");
        return cxt;
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }

}
```



`AbstractDispatcherServletInitializer`同样也提供了便捷的方式来添加过滤器`Filter`实例并使他们自动被映射到`DispatcherServlet`下：

```java
public class MyWebAppInitializer extends AbstractDispatcherServletInitializer {

    // ...

    @Override
    protected Filter[] getServletFilters() {
        return new Filter[] { new HiddenHttpMethodFilter(), new CharacterEncodingFilter() };
    }

}
```

每个过滤器被添加时，默认的名称都基于其类类型决定，并且它们会被自动地映射到`DispatcherServlet`下。

关于异步支持，`AbstractDispatcherServletInitializer`的保护方法`isAsyncSupported`提供了一个集中的地方来开关`DispatcherServlet`上的这个配置，它会对所有映射到这个分发器上的过滤器生效。默认情况下，这个标志被设为`true`。

最后，如果你需要对`DispatcherServlet`做进一步的定制，你可以覆写`createDispatcherServlet`这个方法。
