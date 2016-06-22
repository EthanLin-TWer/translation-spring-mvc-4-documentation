# 21.11.2 @ExceptionHandler注解

`HandlerExceptionResolver`接口以及`SimpleMappingExceptionResolver`解析器类的实现使得你能声明式地将异常映射到特定的视图上，还可以在异常被转发（forward）到对应的视图前使用Java代码做些判断和逻辑。不过在一些场景，特别是依靠`@ResponseBody`返回响应而非依赖视图解析机制的场景下，直接设置响应的状态码并将客户端需要的错误信息直接写回响应体中，可能是更方便的方法。

你也可以使用`@ExceptionHandler`方法来做到这点。如果`@ExceptionHandler`方法是在控制器内部定义的，那么它会接收并处理由控制器（或其任何子类）中的`@RequestMapping`方法抛出的异常。如果你将`@ExceptionHandler`方法定义在`@ControllerAdvice`类中，那么它会处理相关控制器中抛出的异常。下面的代码就展示了一个定义在控制器内部的`@ExceptionHandler`方法：

```java
@Controller
public class SimpleController {

    // @RequestMapping methods omitted ...

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException ex) {
        // prepare responseEntity
        return responseEntity;
    }

}
```

此外，`@ExceptionHandler`注解还可以接受一个异常类型的数组作为参数值。若抛出了已在列表中声明的异常，那么相应的`@ExceptionHandler`方法将会被调用。如果没有给注解任何参数值，那么默认处理的异常类型将是方法参数所声明的那些异常。

与标准的控制器`@RequestMapping`注解处理方法一样，`@ExceptionHandler`方法的方法参数和返回值也可以很灵活。比如，在Servlet环境下方法可以接收`HttpServletRequest`参数，而Portlet环境下方法可以接收`PortletRequest`参数。返回值可以是`String`类型——这种情况下会被解析为视图名——可以是`ModelAndView`类型的对象，也可以是`ResponseEntity`。或者你还可以在方法上添加`@ResponseBody`注解以使用消息转换器会转换信息为特定类型的数据，然后把它们写回到响应流中。
