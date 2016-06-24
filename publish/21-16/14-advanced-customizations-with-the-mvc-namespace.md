# 21.16.14 使用MVC命名空间进行高级的定制化

如果使用MVC命名空间，要在默认配置的基础上实现粒度更细的控制，则要比使用MVC Java编程配置的方式难一些。

如果你确实需要这么做，那也尽量不要复制默认提供的配置，请尝试配置一个`BeanPostProcessor`后置处理器，用它来检测你要定制的bean。可以通过bean的类型来找，找到以后再修改需要定制的属性值。比如这样：


```java
@Component
public class MyPostProcessor implements BeanPostProcessor {

    public Object postProcessBeforeInitialization(Object bean, String name) throws BeansException {
        if (bean instanceof RequestMappingHandlerAdapter) {
            // 修改适配器的属性
        }
    }

}
```

注意，`MyPostProcessor`需要被包含在`<component scan/>`的路径下，这样它才能被自动检测到；或者你也可以手动显式地用一个XML的bean定义来声明它。
