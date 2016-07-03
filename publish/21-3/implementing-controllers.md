# 21.3 控制器(Controller)的实现

> Controllers provide access to the application behavior that you typically define through a service interface. Controllers interpret user input and transform it into a model that is represented to the user by the view. Spring implements a controller in a very abstract way, which enables you to create a wide variety of controllers.

控制器作为应用程序逻辑的处理入口，它会负责去调用你已经实现的一些服务。通常，一个控制器会接收并解析用户的请求，然后把它转换成一个模型交给视图，由视图渲染出页面最终呈现给用户。Spring以高度的抽象来定义控制器，这使得你可以创建多种类型的控制器。

Spring 2.5以后引入了基于注解的编程模型，你可以在你的控制器实现上添加`@RequestMapping`、`@RequestParam`、`@ModelAttribute`等注解。注解特性既支持基于Servlet的MVC，也可支持基于Portlet的MVC。通过此种方式实现的控制器既无需继承某个特定的基类，也无需实现某些特定的接口。而且，它通常也不会直接依赖于Servlet或Portlet的API来进行编程，不过你仍然可以很容易地获取Servlet或Portlet相关的变量、特性和设施等。

> 在[Spring项目的官方Github](https://github.com/spring-projects)上你可以找到许多项目，它们对本节所述以后的注解支持提供了进一步增强，比如说MvcShowcase，MvcAjax，MvcBasic，PetClinic，PetCare等。

```java
@Controller
public class HelloWorldController {

    @RequestMapping("/helloWorld")
    public String helloWorld(Model model) {
        model.addAttribute("message", "Hello World!");
        return "helloWorld";
    }
}
```

你可以看到，`@Controller`注解和`@RequestMapping`注解支持多样的方法名和方法签名。在上面这个例子中，方法接受一个`Model`类型的参数并返回一个字符串`String`类型的视图名。但事实上，方法所支持的参数和返回值有非常多的选择，这个我们在本小节的后面部分会提及。`@Controller`和`@RequestMapping`及其他的一些注解，共同构成了Spring MVC框架的基本实现。本节将详细地介绍这些注解，以及它们在一个Servlet环境下最常被使用到的一些场景。
