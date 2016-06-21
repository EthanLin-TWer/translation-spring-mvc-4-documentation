# 21.10.4 处理表单中的文件上传

当解析器`MultipartResolver`完成处理时，请求便会像其他请求一样被正常流程处理。首先，创建一个接受文件上传的表单将允许用于直接上传整个表单。编码属性（`enctype="multipart/form-data"`）能让浏览器知道如何对多路上传请求的表单进行编码（encode）。

```html
<html>
    <head>
        <title>Upload a file please</title>
    </head>
    <body>
        <h1>Please upload a file</h1>
        <form method="post" action="/form" enctype="multipart/form-data">
            <input type="text" name="name"/>
            <input type="file" name="file"/>
            <input type="submit"/>
        </form>
    </body>
</html>
```

下一步是创建一个能处理文件上传的控制器。这里需要的控制器与[一般注解了`@Controller`的控制器](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-ann-controller "21.3.1 Defining a controller with @Controller")基本一样，除了它接受的方法参数类型是`MultipartHttpServletRequest`，或`MultipartFile`。


```java
@Controller
public class FileUploadController {

    @RequestMapping(path = "/form", method = RequestMethod.POST)
    public String handleFormUpload(@RequestParam("name") String name, @RequestParam("file") MultipartFile file) {

        if (!file.isEmpty()) {
            byte[] bytes = file.getBytes();
            // store the bytes somewhere
            return "redirect:uploadSuccess";
        }

        return "redirect:uploadFailure";
    }

}
```

请留意`@RequestParam`注解是如何将方法参数对应到表单中的定义的输入字段的。在上面的例子中，我们拿到了`byte[]`文件数据，只是没对它做任何事。在实际应用中，你可能会将它保存到数据库、存储在文件系统上，或做其他的处理。

当使用Servlet 3.0的多路传输转换时，你也可以使用`javax.servlet.http.Part`作为方法参数：

```java
@Controller
public class FileUploadController {

    @RequestMapping(path = "/form", method = RequestMethod.POST)
    public String handleFormUpload(@RequestParam("name") String name, @RequestParam("file") Part file) {

        InputStream inputStream = file.getInputStream();
        // store bytes from uploaded file somewhere

        return "redirect:uploadSuccess";
    }

}
```
