```java
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserDao {

    // 通过用户名模糊查询用户
    @Select("SELECT * FROM user WHERE name LIKE CONCAT('%', #{name}, '%')")
    List<User> findUsersByName(@Param("name") String name);

    // 通过组别名称模糊查询组别
    @Select("SELECT * FROM group WHERE name LIKE CONCAT('%', #{name}, '%')")
    List<Group> findGroupsByName(@Param("name") String name);

    // 通过部门名称模糊查询部门
    @Select("SELECT * FROM department WHERE name LIKE CONCAT('%', #{name}, '%')")
    List<Department> findDepartmentsByName(@Param("name") String name);

    // 综合查询：通过部门名称、组别名称或用户名模糊查询
    @Select("<script>" +
            "SELECT u.* FROM user u " +
            "LEFT JOIN user_group ug ON u.id = ug.user_id " +
            "LEFT JOIN group g ON ug.group_id = g.id " +
            "LEFT JOIN department d ON g.department_id = d.id " +
            "WHERE 1=1 " +
            "<if test='userName != null'> AND u.name LIKE CONCAT('%', #{userName}, '%') </if>" +
            "<if test='groupName != null'> AND g.name LIKE CONCAT('%', #{groupName}, '%') </if>" +
            "<if test='departmentName != null'> AND d.name LIKE CONCAT('%', #{departmentName}, '%') </if>" +
            "</script>")
    List<User> findUsersByConditions(
            @Param("userName") String userName,
            @Param("groupName") String groupName,
            @Param("departmentName") String departmentName);
}
```

**AOP 的核心思想**就是在某个功能模块（比如一个方法）的前后加上其他功能（比如日志、权限检查、性能监控等），而不需要修改原来的代码。这种方式可以让代码更干净、更模块化。

