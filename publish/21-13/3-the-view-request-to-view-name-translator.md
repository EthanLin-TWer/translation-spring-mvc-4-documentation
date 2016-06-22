# 21.13.3 视图-请求与视图名的映射

`RequestToViewNameTranslator`接口可以在逻辑视图名未被显式提供的情况下，决定一个可用的逻辑视图`View`名。

`DefaultRequestToViewNameTranslator`能够将请求URL映射到逻辑视图名上去，如下面代码例子所示：

```java
public class RegistrationController implements Controller {

    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) {
        // 处理请求……
        ModelAndView mav = new ModelAndView();
        // 向Model中添加需要的数据
        return mav;
        // 请注意这里，没有设置任何View对象或逻辑视图名
    }

}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 这个众人皆知的bean将为我们自动生成视图名 -->
    <bean id="viewNameTranslator" class="org.springframework.web.servlet.view.DefaultRequestToViewNameTranslator"/>

    <bean class="x.y.RegistrationController">
        <!-- 如果需要，注入依赖 -->
    </bean>

    <!-- 请请求URL映射到控制器名 -->
    <bean class="org.springframework.web.servlet.mvc.support.ControllerClassNameHandlerMapping"/>

    <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

</beans>
```

请注意在`handleRequest(...)`方法实现中，返回的`ModelAndView`对象上自始至终未设置任何`View`对象或逻辑视图名。这是由`DefaultRequestToViewNameTranslator`完成的，它的任务就是从请求的URL中生成一个_逻辑视图名_。在上面的例子中，`RegistrationController`与配置的`ControllerClassNameHandlerMapping`一起使用的结果是，一个URL为`<http://localhost/registration.html>`的请求，会经由`DefaultRequestToViewNameTranslator`生成并对应到一个逻辑视图名`registration`上。该逻辑视图名又会由`InternalResourceViewResolver`bean解析到`/WEB-INF/jsp/registration.jsp`视图上。

> 你无需显式地定义一个`DefaultRequestToViewNameTranslator`bean。如果默认的`DefaultRequestToViewNameTranslator`配置已能满足你的需求，那么你无需配置，Spring Web MVC的`DispatcherServlet`会为你实例化这样一个默认的对象。

当然，如果你需要更改默认的设置，那你就需要手动地配置自己的`DefaultRequestToViewNameTranslator`bean。关于可配置属性的一些详细信息，你可以去咨询`DefaultRequestToViewNameTranslator`类详细的java文档。
