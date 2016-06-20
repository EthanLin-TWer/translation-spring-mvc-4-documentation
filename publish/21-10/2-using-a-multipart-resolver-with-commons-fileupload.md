# 21.10.2 使用MultipartResolver与Commons FileUpload传输文件

下面的代码展示了如何使用一个通用的多路上传解析器`CommonsMultipartResolver`：

```xml
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">

    <!-- 支持的其中一个属性，支持的最大文件大小，以字节为单位 -->
    <property name="maxUploadSize" value="100000"/>

</bean>
```

当然，要让多路解析器正常工作，你需要在classpath路径下准备必须的jar包。如果使用的是通用的多路上传解析器`CommonsMultipartResolver`，你所需要的jar包是`commons-fileupload.jar`。

当Spring的`DispatcherServlet`检测到一个多部分请求时，它会激活你在上下文中声明的多路解析器并把请求交给它。解析器会把当前的`HttpServletRequest`请求对象包装成一个支持多路文件上传的请求对象`MultipartHttpServletRequest`。有了`MultipartHttpServletRequest`对象，你不仅可以获取该多路请求中的信息，还可以在你的控制器中获得该多路请求的内容本身。
