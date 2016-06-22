# 21.13.2 模型ModelMap(ModelAndView)

`ModelMap`类其实就是一个豪华版的 `Map`，它使得你为视图展示需要所添加的对象都遵循一个显而易见的约定被命名。请看下面这个 `Controller`实现，并请注意，添加到`ModelAndView`中去的对象都没有显式地指定键名。

```java
public class DisplayShoppingCartController implements Controller {

    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) {

        List cartItems = // 拿到一个CartItem对象的列表
        User user = // 拿到当前购物的用户User

        ModelAndView mav = new ModelAndView("displayShoppingCart"); <-- 逻辑视图名

        mav.addObject(cartItems); <-- 啊哈，直接添加的对象，没有指定名称
        mav.addObject(user); <-- 啊哈再来一次

        return mav;
    }
}
```

`ModelAndView`内部使用了一个`ModelMap`类，它是`Map`的一个实现，会自动为添加进来的对象生成一个键名。为添加对象生成名称的策略是，若添加对象是一个纯Java bean（a scalar object），比如`User`，那么使用对象类的短类名（short class name）来作为该对象的名称。下面是一些例子，展示了为添加到`ModelMap`实例中的纯Java对象所生成的名称：

* 添加一个`x.y.User`实例，为其生成的名称为`user`
* 添加一个`x.y.Registration`实例，为其生成的名称为`registration`
* 添加一个`x.y.Foo`实例，为其生成的名称为`foo`
* 添加一个`java.util.HashMap`实例，为其生成的名称为`hashMap`。这种情况下，显式地声明一个键名可能更好，因为`hashMap`的约定并非那么符合直觉
* 添加一个`null`值将导致程序抛出一个`IllegalArgumentException`参数非法异常。若你所添加的（多个）对象有可能为`null`值，那你也需要显式地指定它（们）的名字

**啥？键名不能自动变复数形式么？**

Spring Web MVC的约定优于配置支持尚不能支持自动复数转换。这意思是，你不能期望往`ModelAndView`中添加一个`Person`对象的`List`列表时，框架会自动为其生成一个名称`people`。

这个决定是经过许多争论后的结果，最终“最小惊喜原则”胜出并为大家所接受。

为集合`Set`或列表`List`生成键名所采取的策略，是先检查集合的元素类型、拿到第一个对象的短类名，然后在其后面添加`List`作为名称。添加数组对象也是同理，尽管对于数组我们就不需再检查数组内容了。下面给出的几个例子可以阐释一些东西，让集合的名称生成语义变得更加清晰：

* 添加一个带零个或多个`x.y.User`元素类型的数组`x.y.User[]`，为其生成的键名是`userList`
* 添加一个带零个或多个`x.y.User`元素类型的数组`x.y.Foo[]`，为其生成的键名是`fooList`
* 添加一个带零个或多个`x.y.User`元素类型的数组`java.util.ArrayList`，为其生成的键名是`userList`
* 添加一个带零个或多个`x.y.Foo`元素类型的数组`java.util.HashSet`，为其生成的键名是`fooList`
* 一个 _空的_ `java.util.ArrayList`则根本不会被添加
