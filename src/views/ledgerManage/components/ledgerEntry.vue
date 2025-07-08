<template>
  <div>
    <!-- 根据类别控制按钮显示 -->
    <el-row style="margin-bottom: 20px">
      <el-button
        type="primary"
        @click="dialogTableVisible = true"
        style="margin-right: 20px"
        >选择物资平台数据</el-button
      >
      <el-button type="primary">二维码扫描</el-button>
    </el-row>

    <div class="scrollable-content">
      <el-card>
        <el-row :gutter="2" style="margin-bottom: 20px;">
          <el-col :span="6">
            <span>项目名称:</span>
            <el-select v-model="project" placeholder="请选择" @change="changeProject">
              <el-option
                v-for="item in options1"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" >
            <span>单位工程（栋）:</span>
            <el-select v-model="subProject" placeholder="请选择" >
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="2" style="margin-bottom: 10px;">
          <el-col :span="6">
            <span>施工单位: </span>
            <span>{{ constructionUnit }}</span>
          </el-col>
          <el-col :span="6">
            <span>建设单位: </span>
            <span>{{ developmentUnit }}</span>
          </el-col>
          <el-col :span="6">
            <span>工程号: </span>
            <span>{{ projectNumber }}</span>
          </el-col>
        </el-row>
      </el-card> 
      <!-- 三个卡片内容 -->
      <el-row :gutter="2" class="equal-height-row">
        <el-col :span="8" >
          <el-card class="card-box">
            <el-form :model="formData" label-width="80px">
              <el-form-item
                v-for="(item, index) in field1"
                :key="index"
                :label="item.label"
                :required="item.required"
              >
                <el-input v-model="formData[item.fieldName]" />
              </el-form-item>
            </el-form> 
          </el-card>
        </el-col>
        <el-col :span="8">   
          <el-card class="card-box">
              <el-form :model="formData" label-width="80px">
                <el-form-item 
                  v-for="(item, index2) in field2" 
                  :key="index2" 
                  :label="item.label"
                  :required="item.required"
                >
                  <el-date-picker
                    v-if="item.dataType === 'DATE'"
                    v-model="formData[item.fieldName]"
                    type="date"
                    placeholder="选择日期"
                  />
                  <el-input
                    v-else
                    v-model="formData[item.fieldName]"
                  />
                </el-form-item>
              </el-form>
            </el-card>
        </el-col>
        <el-col :span="8" >
           <el-card class="card-box">
              <el-form :model="formData" label-width="80px">
                <el-form-item
                  v-for="(item, index3) in field3"
                  :key="index3"
                  :label="item.label"
                  :required="item.required"
                >
                  <!-- 单输入框（直接绑定） -->
                  <el-input
                    v-if="item.dataCount === 1"
                    v-model="formData[item.fieldName]"
                  />

                  <!-- 多输入框（手动处理 JSON 数组） -->
                  <template v-else> 
                    <el-input
                      v-for="i in item.dataCount"
                      :key="`${item.fieldName}_${i}`"
                      :value="getMultiInputValue(item.fieldName, i - 1)"
                      :style="getInputStyle(item.dataCount)"
                      :placeholder="`请输入${item.label}${item.dataCount > 1 ? i : ''}`"
                      @input="val => updateMultiInputValue(item.fieldName, i - 1, val)"
                    />
                  </template>
                </el-form-item>
              </el-form>
            </el-card>
        </el-col>
       
       
       
      </el-row>

      <div class="footer-buttons">
        <el-button type="primary">保存</el-button>
        <el-button @click="changeIndex()">取消</el-button>
      </div>
    </div>

    <!-- 物资选择对话框 -->
    <el-dialog title="选择物资平台数据" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column label="选择" width="60" fixed>
          <template slot-scope="scope">
            <el-radio
              v-model="selectedMaterial"
              :label="scope.row.id"
              @change="handleMaterialSelect(scope.row)"
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          label="物资名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="provider"
          label="供应商"
          width="150"
        ></el-table-column>
        <el-table-column
          property="specification"
          label="规格"
          width="150"
        ></el-table-column>
        <el-table-column
          property="part"
          label="工程部位"
          width="150"
        ></el-table-column>
        <el-table-column
          property="num"
          label="入库数量"
          width="150"
        ></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMaterialSelection"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
 getAllProjectName,
 getAllSubrojectName,
 getFieldName,
 getProjectInfo,
 getFormData,

} from "@/api/ledger";
import { getUser } from "@/utils/storage";
import da from "element-ui/src/locale/lang/da";
export default {
  data() {
    return {
      selectedMaterial: null, // 当前选中的物资索引
      selectedMaterialData: null, // 当前选中的物资数据
      gridData: [
        {
          id: 1,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
        {
          id: 2,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
        {
          id: 3,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
        {
          id: 4,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
      ],
      dialogTableVisible: false,
      userId:null,
      options1: [
        {
          value: "选项1",
          label: "A",
        },
        {
          value: "选项2",
          label: "B",
        },
        {
          value: "选项3",
          label: "C",
        },
        {
          value: "选项4",
          label: "C",
        },
        {
          value: "选项5",
          label: "D",
        },
      ],
      project: "",
      options2: [
        {
          value: "选项1",
          label: "E",
        },
        {
          value: "选项2",
          label: "F",
        },
        {
          value: "选项3",
          label: "G",
        },
        {
          value: "选项4",
          label: "H",
        },
        {
          value: "选项5",
          label: "I",
        },
      ],
      subProject: "",
      // 项目基本信息
      constructionUnit: "",
      developmentUnit: "",
      projectNumber: "",
      // 相关字段
      field1:[],
      field2:[],
      field3:[],
      formData:{},
     
    };
  },
  props: {
    index: Number,
    category: String,
    dataId: {
      type: Number,
      default: null, // 默认值为null
    },
  },
  computed: {
    // 控制物资相关按钮的显示
    showMaterialButtons() {
      return this.category === "raw";
    },
    //台账类型
    ledgerType() {
      if (this.category === "钢筋原材") {
        return 1;
      }else if (this.category === "钢筋机械连接") {
        return 2;
      } else if (this.category === "钢筋焊接") {
        return 3;
      } else if (this.category === "混凝土强度") {
        return 4;
      } else {
        return 0; // 默认值
      }
    },
  },
  watch: {},
  created(){
    const user =getUser()
    this.userId=user.userId
  },
  mounted() {
     this.getAllProjectName();
     this.getFieldName();
     if (this.dataId) {
       // 如果有 dataId，说明是编辑状态
       this.editMaterialData();
     }
   
   
  },
  methods: {
    async getAllProjectName(){
       try {
        let res = await getAllProjectName(this.userId);
        if (res.code == 200) {
          this.options1=res.result
          
        } else {
          throw new Error(res.message || "获取项目名称失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }

    },
    changeProject(value) {
      // console.log("选中的项目ID:", value);
      const projectId = String(value);
      // 处理项目选择变化
      this.getAllSubrojectName(projectId);
      this.getProjectInfo(projectId);
    },
    async getAllSubrojectName(projectId) {
      // 获取所有子项目名称
      try {
        let res = await getAllSubrojectName(projectId);
        if (res.code == 200) {
          console.log(res.result);
          this.options2 = res.result.map(item => ({
            value: item.subprojectId,
            label: item.subprojectName
          }));
        } else {
          throw new Error(res.message || "获取项目信息失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },  
    async getProjectInfo(projectId) {
      // 获取项目基本信息
         try {
        let res = await getProjectInfo(projectId);
        if (res.code == 200) {
          console.log(res.result);
          this.constructionUnit = res.result.jiansheCompanyName || "";
          this.developmentUnit = res.result.shigongCompanyName || "";
          this.projectNumber = res.result.projectInnerCode || "";

        } else {
          throw new Error(res.message || "获取项目信息失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    //获取字段名称
    async getFieldName() { 
     try {
        let res = await getFieldName(this.ledgerType);
        if (res.code == 200) {
          // 遍历 result 数组
          res.result.forEach(item => {
            switch (item.showPosition) {
              case 1:
                this.field1.push(item);
                break;
              case 2:
                this.field2.push(item);
                break;
              case 3:
                this.field3.push(item);
                break;
              default:
                console.warn(`发现未知 showPosition 值: ${item.showPosition}`, item);
            }
          });
          console.log("字段名称获取成功", this.field1, this.field2, this.field3 );
        } else {
          throw new Error(res.message || "获取字段名称失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    getInputStyle(count) {
      return { width: `${100 / count}%` };
    },
    // 从 JSON 字符串中获取第 n 个值
    getMultiInputValue(fieldName, index) {
        if (!this.formData[fieldName]) return "";
        const arr = JSON.parse(this.formData[fieldName]);
        return arr[index] || "";
    },
    // 更新 JSON 字符串中的第 n 个值
    updateMultiInputValue(fieldName, index, val) {
        const arr = this.formData[fieldName] ? JSON.parse(this.formData[fieldName]) : [];
        arr[index] = val;
        this.$set(this.formData, fieldName, JSON.stringify(arr));
    },
    //编辑状态 获取原始物资数据
    async editMaterialData() {
      try {
        console.log("编辑状态，获取物资数据" , this.ledgerType, this.dataId);
        let res = await getFormData(this.ledgerType,this.dataId);
        if (res.code == 200) {
          console.log("获取物资数据成功", res);
          this.formData = res.result;
        } else {
          throw new Error(res.message || "获取物资数据失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }

    },
    handleMaterialSelect(row) {
      // 处理物资选择
      this.selectedMaterialData = row;
      // 自动填充表单字段
      this.steelType = row.name;
      this.manufacturer = row.provider;
      this.nominalDiameter = row.specification;
    },
    confirmMaterialSelection() {
      // 确认选择并关闭对话框
      if (this.selectedMaterialData) {
        // 可以添加其他处理逻辑
      }
      this.dialogTableVisible = false;
    },
    //取消按钮，同时向父组件传参，
    changeIndex() {
      this.$emit("update-index", 0);
    },
  },
};
</script>
<style scoped>
.equal-height-row {
  display: flex;
  align-items: stretch; /* 让每个列的高度一致 */
}

.equal-height-row >>> .el-col {
  display: flex;
  flex-direction: column;
}

.card-box {
  flex: 1; /* 让 card 撑满列的高度 */
  display: flex;
  flex-direction: column;
}
</style>

<style>
.ledger-entry-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 占满整个视口高度 */
  padding: 20px;
  box-sizing: border-box;
}

.scrollable-content {
  flex: 1;
  /* 占据剩余空间 */
  overflow-y: auto;
  /* 添加垂直滚动条 */
  padding-bottom: 20px;
  /* 为底部按钮留出空间 */
}

.footer-buttons {
  margin-right: 8px;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 10px;
}

.spaced-row {
  margin-bottom: 5px;
}
</style>