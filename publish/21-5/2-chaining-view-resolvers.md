# 21.5.2 视图链

Spring支持同时使用多个视图解析器。因此，你可以配置一个解析器链，并做更多的事比如，在特定条件下覆写一个视图等。你可以通过把多个视图解析器设置到应用上下文(application context)中的方式来串联它们。如果需要指定它们的次序，那么设置`order`属性即可。请记住，order属性的值越大，该视图解析器在链中的位置就越靠后。

在下面的代码例子中，视图解析器链中包含了两个解析器：一个是`InternalResourceViewResolver`，它总是自动被放置在解析器链的最后；另一个是`XmlViewResolver`，它用来指定Excel视图。`InternalResourceViewResolver`不支持Excel视图。

```xml
<bean id="jspViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
    <property name="prefix" value="/WEB-INF/jsp/"/>
    <property name="suffix" value=".jsp"/>
</bean>

<bean id="excelViewResolver" class="org.springframework.web.servlet.view.XmlViewResolver">
    <property name="order" value="1"/>
    <property name="location" value="/WEB-INF/views.xml"/>
</bean>

<!-- in views.xml -->

<beans>
    <bean name="report" class="org.springframework.example.ReportExcelView"/>
</beans>
```

如果一个视图解析器不能返回一个视图，那么Spring会继续检查上下文中其他的视图解析器。此时如果存在其他的解析器，Spring会继续调用它们，直到产生一个视图返回为止。如果最后所有视图解析器都不能返回一个视图，Spring就抛出一个`ServletException`。

视图解析器的接口清楚声明了，一个视图解析器是_可以_返回null值的，这表示不能找到任何合适的视图。并非所有的视图解析器都这么做，但是也存在不得不如此的场景，即解析器确实无法检测对应的视图是否存在。比如，`InternalResourceViewResolver`在内部使用了`RequestDispatcher`，并且进入分派过程是检测一个JSP视图是否存在的唯一方法，但这个过程仅可能发生唯一一次。同样的`VelocityViewResolver`和部分其他的视图解析器也存在这样的情况。具体的请查阅某个特定的视图解析器的Java文档，看它是否会report不存在的视图。因此，如果不把`InternalResourceViewResolver`放置在解析器链的最后，将可能导致解析器链无法完全执行，因为`InternalResourceViewResolver`_永远都会_ 返回一个视图。
