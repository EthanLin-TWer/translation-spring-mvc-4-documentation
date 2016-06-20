# 21.9.2 定义主题

要在你的应用中使用主题，你必须实现一个`org.springframework.ui.context.ThemeSource`接口。`WebApplicationContext`接口继承了`ThemeSource`接口，但主要的工作它还是委托给接口具体的实现来完成。默认的实现是`org.springframework.ui.context.support.ResourceBundleThemeSource`，它会从classpath的根路径下去加载配置文件。如果需要定制`ThemeSource`的实现，或要配置`ResourceBundleThemeSource`的基本前缀名（base name prefix），你可以在应用上下文（application context）下注册一个名字为保留名`themeSource`的bean，web应用的上下文会自动检测名字为`themeSource`的bean并使用它。

使用的是`ResourceBundleThemeSource`时，一个主题可以定义在一个简单的配置文件中。该配置文件会列出所有组成了该主题的资源。下面是个例子：

```
    styleSheet=/themes/cool/style.css
    background=/themes/cool/img/coolBg.jpg
```

属性的键（key）是主题元素在视图代码中被引用的名字。对于JSP视图来说，一般通过`spring:theme`这个定制化的标签（tag）来做，它与`spring:message`标签很相似。以下的JSP代码即使用了上段代码片段中定义的主题，用以定制整体的皮肤：

```html
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<html>
    <head>
        <link rel="stylesheet" href="<spring:theme code=''styleSheet''/>" type="text/css"/>
    </head>
    <body style="background=<spring:theme code=''background''/>">
        ...
    </body>
</html>
```

默认情况下`ResourceBundleThemeSource`使用的基本名前缀（base name prefix）是空值。也即是说，配置文件是从根classpath路径下加载的。因此，你需要把主题的定义文件`cool.properties`放在classpath的根路径目录下，比如，`/WEB-INF/classes`。`ResourceBundleThemeSource`采用了Java的标准资源bundle加载机制，完全支持国际化主题。比如，你可以创建一个`/WEB-INF/classes/cool_nl.properties`配置文件，并在其中引用一副有荷兰文的背景图片。
