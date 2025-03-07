```java
import java.lang.reflect.Method;

class Greeter {
    public void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        // 获取类的 Class 对象
        Class<?> clazz = Class.forName("Greeter");

        // 创建对象实例
        Object obj = clazz.getDeclaredConstructor().newInstance();

        // 获取方法
        Method method = clazz.getMethod("greet", String.class);

        // 调用方法
        method.invoke(obj, "Bob");  // 输出: Hello, Bob!
    }
}
```

**AOP 的核心思想**就是在某个功能模块（比如一个方法）的前后加上其他功能（比如日志、权限检查、性能监控等），而不需要修改原来的代码。这种方式可以让代码更干净、更模块化。

