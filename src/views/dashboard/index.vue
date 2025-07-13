<template>
  <div class="dashboard-container">
    <!-- 第一行：最近使用 + 待办中心 -->
    <el-row :gutter="10" class="row-recent">
      <el-col :xs="24" :md="16">
        <DashboardCard title="最近使用">
          <el-card shadow="hover">
            <app-list :apps="recentApps" @click-app="handleAppClick" />
          </el-card>
        </DashboardCard>
      </el-col>
       <el-col :xs="24" :md="8">
        <DashboardCard title="消息中心">
          <el-card shadow="hover">
            <news-list :news="news" @click-item="handleNewsClick" />
          </el-card>
        </DashboardCard>
      </el-col>
    </el-row>

    <!-- 第二行：应用中心 -->
    <el-row :gutter="10" class="row-app-center mt-20">
      <el-col :xs="24" :md="16">
        <DashboardCard title="应用中心">
          <el-card shadow="hover">
            <app-list :apps="allApps1" @click-app="handleAppClick" />
            <app-list :apps="allApps2" @click-app="handleAppClick" />
          </el-card>
        </DashboardCard>
      </el-col>
      <el-col :xs="24" :md="8">
        <DashboardCard title="待办中心">
          <el-card shadow="hover">
            <todo-list :todos="todos" @complete="handleCompleteTodo" />
          </el-card>
        </DashboardCard>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import DashboardCard from "./components/DashboardCard.vue";
import QuickActions from "./components/QuickActions.vue";
import RecentActivities from "./components/RecentActivities.vue";
import AppList from "./components/AppList.vue";
import TodoList from "./components/TodoList";
import NewsList from "./components/NewsList";

export default {
  name: "Dashboard",
  components: {
    DashboardCard,
    QuickActions,
    RecentActivities,
    AppList,
    TodoList,
    NewsList,
  },
  data() {
    return {
      recentApps: [
        { id: 1, name: "项目管理", icon: "program", usedAt: "2023-05-15" },
        {
          id: 2,
          name: "验收规范管理",
          icon: "specification",
          usedAt: "2023-05-15",
        },
        { id: 3, name: "台账管理", icon: "ledger", usedAt: "2023-05-15" },
      ],
      allApps1: [
        { id: 1, name: "项目管理", icon: "program" },
        { id: 2, name: "验收规范管理", icon: "specification" },
        { id: 3, name: "台账管理", icon: "ledger" },
        { id: 4, name: "报表管理", icon: "statement" },
        { id: 5, name: "数据采集情况", icon: "dataCollection" },
      ],
      allApps2: [
        { id: 6, name: "数据采集任务", icon: "task" },
        { id: 7, name: "OCR模版库", icon: "ocr" },
        { id: 8, name: "角色管理", icon: "role1" },
        { id: 9, name: "人员管理", icon: "role" },
      ],
      todos: [
        {
          id: 1,
          title: "完成项目审核",
          deadline: "2023-05-20",
          completed: false,
        },
        {
          id: 2,
          title: "项目采集",
          deadline: "2023-05-18",
          completed: false,
        },
        {
          id: 3,
          title: "安排团队建设活动",
          deadline: "2023-05-25",
          completed: false,
        },
      ],
      news: [
        {
          id: 1,
          title: "关于端午节放假安排的通知",
          date: "2023-05-10",
          isNew: true,
        },
        {
          id: 2,
          title: "2023年第二季度员工培训计划",
          date: "2023-05-08",
          isNew: false,
        },
        {
          id: 3,
          title: "公司新福利政策解读",
          date: "2023-05-05",
          isNew: false,
        },
      ],
    };
  },
  methods: {
    handleAction(action) {
      this.$message.success(`执行操作: ${action}`);
    },
    handleAppClick(app) {
      console.log("打开应用:", app.name);
      // 实际项目中这里可以跳转到对应应用

      // 应用跳转路由映射
      const routeMap = {
        项目管理: "/menus/project",
        验收规范管理: "/menus/inspection",
        台账管理: "/menus/ledger",
        报表管理: "/menus/statement",
        数据采集情况: "/menus/collection",
        数据采集任务: "/menus/task",
        OCR模版库:"/menus/ocrTemplate",
        角色管理: "/menus/roles",
        人员管理: "/menus/users", //要跳转的页面
      };

      const routePath = routeMap[app.name];
      if (routePath) {
        this.$router.push(routePath); // 使用 Vue Router 跳转
      }

      // 更新最近使用记录
      const index = this.recentApps.findIndex((item) => item.id === app.id);
      if (index !== -1) {
        // 如果已存在，更新使用时间
        this.recentApps[index].usedAt = new Date().toISOString().split("T")[0];
      } else {
        // 如果不存在，添加到最近使用
        this.recentApps.unshift({
          ...app,
          usedAt: new Date().toISOString().split("T")[0],
        });
        // 保持最近使用最多显示6个
        if (this.recentApps.length > 6) {
          this.recentApps.pop();
        }
      }

      // 按使用时间排序
      this.recentApps.sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt));
    },
    handleCompleteTodo(todo) {
      const index = this.todos.findIndex((item) => item.id === todo.id);
      if (index !== -1) {
        this.todos[index].completed = true;
      }
    },
    handleNewsClick(newsItem) {
      console.log("查看资讯:", newsItem.title);
      // 实际项目中这里可以跳转到资讯详情页
    },
  },
};
</script>

<style scoped>
.row-recent {
  margin-bottom: 5px;
}

.row-recent .el-card {
  height: 150px;
  /* overflow: auto; */
}

.row-app-center .el-card {
  height: 480px; /* 主功能最大 */
  /* overflow: auto; */
}

.mt-20 {
  margin-top: 20px;
}

</style>