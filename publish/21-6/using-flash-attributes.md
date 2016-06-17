# 21.6 使用闪存属性FlashAttributes

Flash属性（flash attributes）提供了一个请求为另一个请求存储有用属性的方法。这在重定向的时候最常使用，比如常见的 _POST/REDIRECT/GET_ 模式。Flash属性会在重定向前被暂时地保存起来（通常是保存在session中），重定向后会重新被下一个请求取用并立即从原保存地移除。

为支持flash属性，Spring MVC提供了两个抽象。`FlashMap`被用来存储flash属性，而用`FlashMapManager`来存储、取回、管理`FlashMap`的实例。

对flash属性的支持默认是启用的，并不需要显式声明，不过没用到它时它绝不会主动地去创建HTTP会话（session）。对于每个请求，框架都会“传进”一个`FlashMap`，里面存储了从上个请求（如果有）保存下来的属性；同时，每个请求也会“输出”一个`FlashMap`，里面保存了要给下个请求使用的属性。两个`FlashMap`实例在Spring MVC应用中的任何地点都可以通过`RequestContextUtils`工具类的静态方法取得。

控制器通常不需要直接接触`FlashMap`。一般是通过`@RequestMapping`方法去接受一个`RedirectAttributes`类型的参数，然后直接地往其中添加flash属性。通过`RedirectAttributes`对象添加进去的flash属性会自动被填充到请求的“输出”`FlashMap`对象中去。类似地，重定向后“传进”的`FlashMap`属性也会自动被添加到服务重定向URL的控制器参数`Model`中去。

**匹配请求所使用的flash属性**

flash属性的概念在其他许多的Web框架中也存在，并且实践证明有时可能会导致并发上的问题。这是因为从定义上讲，flash属性保存的时间是到下个请求接收到之前。问题在于，“下一个”请求不一定刚好就是你要重定向到的那个请求，它有可能是其他的异步请求（比如polling请求或者资源请求等）。这会导致flash属性在到达真正的目标请求前就被移除了。

为了减少这个问题发生的可能性，重定向视图`RedirectView`会自动为一个`FlashMap`实例记录其目标重定向URL的路径和查询参数。然后，默认的`FlashMapManager`会在为请求查找其该“传进”的`FlashMap`时，匹配这些信息。

这并不能完全解决重定向的并发问题，但极大程度地减少了这种可能性，因为它可以从重定向URL已有的信息中来做匹配。因此，一般只有在重定向的场景下，我们才推荐使用flash属性。
