# 21.10.5 处理客户端发起的文件上传请求

在使用了RESTful服务的场景下，非浏览器的客户端也可以直接提交多路文件请求。上一节讲述的所有例子与配置在这里也都同样适用。但与浏览器不同的是，提交的文件和简单的表单字段，客户端发送的数据可以更加复杂，数据可以指定为某种特定的内容类型（content type）——比如，一个多路上传请求可能第一部分是个文件，而第二部分是个JSON格式的数据：

```
    POST /someUrl
    Content-Type: multipart/mixed

    --edt7Tfrdusa7r3lNQc79vXuhIIMlatb7PQg7Vp
    Content-Disposition: form-data; name="meta-data"
    Content-Type: application/json; charset=UTF-8
    Content-Transfer-Encoding: 8bit

    {
        "name": "value"
    }
    --edt7Tfrdusa7r3lNQc79vXuhIIMlatb7PQg7Vp
    Content-Disposition: form-data; name="file-data"; filename="file.properties"
    Content-Type: text/xml
    Content-Transfer-Encoding: 8bit
    ... File Data ...
```

对于名称为`meta-data`的部分，你可以通过控制器方法上的`@RequestParam("meta-data") String metadata`参数来获得。但对于那部分请求体中为JSON格式数据的请求，你可能更想通过接受一个对应的强类型对象，就像`@RequestBody`通过`HttpMessageConverter`将一般请求的请求体转换成一个对象一样。

这是可能的，你可以使用`@RequestPart`注解来实现，而非`@RequestParam`。该注解将使得特定多路请求的请求体被传给`HttpMessageConverter`，并且在转换时考虑多路请求中不同的内容类型参数`'Content-Type'`：


```java
@RequestMapping(path = "/someUrl", method = RequestMethod.POST)
public String onSubmit(@RequestPart("meta-data") MetaData metadata, @RequestPart("file-data") MultipartFile file) {

    // ...

}
```

请注意`MultipartFile`方法参数是如何能够在`@RequestParam`或`@RequestPart`注解下互用的，两种方法都能拿到数据。但，这里的方法参数`@RequestPart("meta-data") MetaData`则会因为请求中的内容类型请求头`'Content-Type'`被读入成为JSON数据，然后再通过`MappingJackson2HttpMessageConverter`被转换成特定的对象。
