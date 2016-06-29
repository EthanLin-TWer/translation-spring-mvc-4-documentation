# 21.3 控制器(controller)的实现

> Controllers provide access to the application behavior that you typically define through a service interface. Controllers interpret user input and transform it into a model that is represented to the user by the view. Spring implements a controller in a very abstract way, which enables you to create a wide variety of controllers.

控制器作为应用程序逻辑的处理入口，它会负责去调用你已经实现的一些服务。通常，一个控制器会先接受用户的请求，先把它转换成一个数据模型（model），模型中的数据将经由视图的渲染最终呈现给用户。Spring对控制器的实现高度抽象，使得你在创建和实现控制器上有很大的余地进行选择和定制。

> Spring 2.5 introduced an annotation-based programming model for MVC controllers that uses annotations such as `@RequestMapping`, `@RequestParam`, `@ModelAttribute`, and so on. This annotation support is available for both Servlet MVC and Portlet MVC. Controllers implemented in this style do not have to extend specific base classes or implement specific interfaces. Furthermore, they do not usually have direct dependencies on Servlet or Portlet APIs, although you can easily configure access to Servlet or Portlet facilities.

Spring 2.5开始采用基于注解的编程方式，使用了`@RequestMapping`、`@RequestParam`、`@ModelAttribute`等注解来支持MVC的控制器实现。这些注解既可应用于基于Servlet的MVC，也可应用于基于Portlet的MVC。通过此种方式实现的控制器既无需继承某个特定的基类，也无需实现某些特定的接口。事实上，它通常也不会直接依赖于Servlet或者Portlet的API来进行编程，但你仍然可以很容易地获取Servlet或Portlet的一些基础配置或设施。

> > Available in the spring-projects Org on Github, a number of web applications leverage the annotation support described in this section including MvcShowcase, MvcAjax, MvcBasic, PetClinic, PetCare, and others.

> 在Spring组织的官方Github上，你可以找到许多项目，它们对本节所述的注解配置方式开发MVC的产生有很大的影响，比如说MvcShowcase，MvcAjax，MvcBasic，PetClinic，PetCare等。

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

> As you can see, the `@Controller` and `@RequestMapping` annotations allow flexible method names and signatures. In this particular example the method accepts a `Model` and returns a view name as a `String`, but various other method parameters and return values can be used as explained later in this section. `@Controller` and `@RequestMapping` and a number of other annotations form the basis for the Spring MVC implementation. This section documents these annotations and how they are most commonly used in a Servlet environment.

从上面的例子可以看到，`@Controller`注解和`@RequestMapping`注解使得方法名和方法签名的选择变得更加灵活。在上面这个例子中，方法接受一个`Model`类型的参数并返回一个字符串`String`类型的视图名，但事实上，方法可以接受的参数和返回值有更多的选择，这个我们在本小节的后面部分会提及。`@Controller`和`@RequestMapping`及其他的一些注解，共同构成了Spring MVC的基本实现。本节将详细地介绍这些注解，介绍它们在一个Servlet环境下最常被使用到的一些场景。



