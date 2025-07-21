<template>
    <div>
        <div class="card-container" style="margin-bottom: 20px;">
            <el-row justify="space-around" class="mb-4 px-6">
                <el-col :span="5" class="text-center">
                    <span class="inline-block">单位工程：{{ rowData.subprojectName }}</span>
                </el-col>
                <el-col :span="5" class="text-center">
                    <span class="inline-block">检验批部位：{{ rowData.inspectPart }}</span>
                </el-col>
                <el-col :span="5" class="text-center">
                    <span class="inline-block">检验批名称：{{ rowData.inspectType }}</span>
                </el-col>
                <el-col :span="5" class="text-center">
                    <span class="inline-block">检验批容量：{{ capacity }}</span>
                </el-col>
            </el-row>
        </div>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="itemName" label="验收项目" align="center"></el-table-column>
            <el-table-column prop="ruleStandard" label="设计要求与规范规定" align="center"></el-table-column>
            <el-table-column prop="sampleAmount" label="样本总数" width="100" align="center"></el-table-column>
            <el-table-column prop="minSample" label="最小抽样批量" width="200" align="center"></el-table-column>
            <el-table-column prop="reportName" label="报告编号" align="center">
                <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.reportName" :key="index" style="margin-right: 8px;">
                        {{ item.reportNumber }}
                        <el-button type="text" icon="el-icon-close" @click="removeReport(scope.row, index)"
                            style="padding: 0; color: red; font-size: 12px;" title="删除"></el-button>
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="warning" @click="editCapactity(scope)" size="small">编辑</el-button>
                    <el-button type="danger" @click="resetCapactity(scope)" size="small">重置</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="footer-buttons">
            <el-button type="primary" @click="submitData()">提交</el-button>
            <el-button @click="quxiao()">取消</el-button>
        </div>
        <!-- 对话框 -->
        <el-dialog title="" :visible.sync="dialogEdit" :show-close="false" @close="resetDialog()">
            <div class="filter-container">
                <span>台账选择</span>
                <el-select v-model="selectType" placeholder="请选择"
                    style="width: 12em; margin-left: 1em; margin-right: 1em" size="mini"
                    @change="onReportTypeChange(selectType)">
                    <el-option v-for="item in reportTypes" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
                <span>其他报告编号和信息（以顿号分隔）</span>
                <el-input v-model="otherInfo" placeholder="请输入内容" style="width: 10em;"></el-input>
            </div>

            <el-table :data="reportData" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed></el-table-column>
                <el-table-column label="台账编号" prop="dataId" align="center"></el-table-column>
                <el-table-column label="报告编号" prop="reportNumber" align="center">
                </el-table-column>
            </el-table>

            <el-pagination style="margin-top: 20px; text-align: center" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="curPage" :page-sizes="[10, 15, 20]"
                :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total">
            </el-pagination>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmCapactity">确 定</el-button>
                <el-button @click="cancelEdit">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { getDetails, getCapacity, getFinishedList, submitData } from '@/api/task';
import { getUser } from '@/utils/storage';
function getStatusText(item) {
    const activeItems = [];

    // 检查每个属性是否为 1，并将对应的中文标签加入数组
    if (item.sampleQiang === 1) activeItems.push('墙');
    if (item.sampleBan === 1) activeItems.push('板');
    if (item.sampleLiang === 1) activeItems.push('梁');
    if (item.sampleZhu === 1) activeItems.push('柱');
    if (item.sampleDtj === 1) activeItems.push('电梯井');
    if (item.sampleGj === 1) activeItems.push('钢筋');
    if (item.sampleHnt === 1) activeItems.push('混凝土');
    if (item.sampleJxlj === 1) activeItems.push('机械链接');
    if (item.sampleDljc === 1) activeItems.push('独立基础');
    if (item.sampleLt === 1) activeItems.push('楼梯');

    // 使用 join 连接数组元素为字符串，以顿号“、”分隔
    return activeItems.join('、');
}
export default {
    data() {
        return {
            collectorId: '',
            collectorName: " collectorName",
            capacityName: "",
            capacityNum: "",
            capacity: "",//检验批容量
            tableData: [
                {
                    reportName: [],
                }
            ],
            dialogEdit: false,
            otherInfo: "",//其他报告编号和信息
            selectType: 1, // 默认选中钢筋原材
            reportTypes: [
                { value: 1, label: '钢筋原材' },
                { value: 2, label: '机械连接' },
                { value: 3, label: '钢筋焊接' },
                { value: 4, label: '混凝土试块' }
            ],
            curReportType: 1,
            reportData: [],
            selectedReportData: [],
            curPage: 1,
            limit: 10,
            total: 0,
            curIndex: -1,//当前编辑的行索引
        }
    },
    computed: {
        // 根据选择的报告类型动态生成表格列配置
        rowData() {
            return this.$store.state.collection.dataEntryRow;
        },
        taskId() { //
            return this.rowData.taskId;
        },
        // subprojectId() {
        //     return this.rowData.subprojectId;
        // }, 
        },
     created() { 
        const user = getUser();
        if (user) {
            this.collectorId = user.userId;   
        }

    },
    mounted() {
        console.log("rowData", this.rowData);
        this.getDetails();
        this.getCapacity();
    },
    methods: {
        async getDetails() {
            try {
                console.log("发请求，获取任务详情数据", this.$route.query.taskId, this.collectorId);
                const res = await getDetails(
                    this.$route.query.taskId,
                    this.collectorId,
                );
                if (res.code === 200) {
                    console.log("任务详情数据", res);
                    this.tableData = (res.result.items || []).map(item => {
                        return {
                            ...item,
                            inspectPart: getStatusText(item),//检查部位
                            reportName: [],
                        };
                    });
                    console.log("任务详情数据", this.tableData);
                } else {
                    throw new Error(res.message || "获取数据状态失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("出错啦，请稍后重试！");
            }
        },
        async getCapacity() {
            console.log("发请求，获取数据");
            try {
                const res = await getCapacity(
                    this.$route.query.taskId,
                );
                if (res.code == 200) {
                    console.log("检验批容量", res);
                    //遍历数组，
                    this.capacity = res.result.map(item => `${item.sourceName}：${item.volume}`).join('；');
                } else {
                    throw new Error(res.message || "获取数据状态失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("出错啦，请稍后重试！");
            }
        },
        // 报告类型变更时触发
        onReportTypeChange(value) {
            console.log("报告类型变更", value);
            this.curReportType = value;
            this.getRepotData();
        },
        async getRepotData() {
            const subprojectId = 1923633316944277505n;
            //获取已完成的台账信息
            try {
                // console.log("获取已完成的台账信息", this.curReportType, this.curPage, this.limit, subprojectId);
                let res = await getFinishedList(this.curReportType, this.curPage, this.limit, subprojectId)
                if (res.code == 200) {
                    console.log("台账信息", res);
                    this.reportData = res.result.records;
                    this.limit = Number(res.result.size);
                    this.total = Number(res.result.total);
                } else {
                    throw new Error(res.message || "获取台账信息失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("出错啦，请稍后重试！");
            }
        },
        removeReport(row, index) {
            this.$confirm('确定要删除这个报告编号吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.reportName.splice(index, 1);
                this.$message.success('已删除');
            }).catch(() => {
                // 用户取消
            });
        },
        //重置按钮
        resetCapactity(value) {
            this.tableData[value.$index].reportName = []
            console.log("重置按钮", value, this.tableData);

        },
        //编辑按钮
        editCapactity(value) {
            this.dialogEdit = true;
            this.onReportTypeChange(this.curReportType)
            this.curIndex = value.$index
            // console.log("编辑按钮", value);
        },
        //分页器
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.curPage = 1;
            this.getRepotData();
        },
        handleCurrentChange(newPage) {
            this.curPage = newPage;
            this.getRepotData();
        },
        handleSelectionChange(selection) {
            this.selectedReportData = selection;
        },
        //对话框关闭，数据清空
        resetDialog() {
            this.otherInfo = "",
                this.reportData = [];
        },
        //对话框关闭按钮
        cancelEdit() {
            this.dialogEdit = false;
        },
        confirmCapactity() {
            console.log('已选择的报告:', this.selectedReportData, this.curReportType);
            this.dialogEdit = false;
            if (Array.isArray(this.selectedReportData)) {
                if (Array.isArray(this.selectedReportData)) {
                    this.selectedReportData.forEach(item => {
                        item.reportType = this.curReportType;
                        // this.tableData[this.curIndex].reportName.push(item.reportNumber || '');
                        this.tableData[this.curIndex].reportName.push(item || {});

                    });
                }
            } else {
                console.warn("selectedReportData 不是一个数组");
            }
            if (this.otherInfo != '') {
                this.tableData[this.curIndex].reportName.push({
                    reportType: 0,//表示额外的
                    reportNumber: this.otherInfo,
                })
            }
            // console.log("编辑后", this.tableData);
        },
        quxiao() {
            this.$router.push({
                path: "taskList",
            });
        },
        //提交数据
        async submitData() {
            console.log("提交数据被点击", this.tableData);
            //整理数据
            const data = {
                task_id: String(this.taskId),//任务主键
                task_item_id: "",//任务项主键
                inspect_item_id: "",//验收项目id
                data_type: "",//任务类型
                fail_resample: "",//是否为总工要求重新采集
                data: [  //任务项对应的数据
                    {
                        collector: "",//采集员名字
                        inspect_part: "",//检查部位(观察和试验报告的是检验批部位整体，尽量的会具体点)
                        part_type: "",//不填  部位类别(墙、板、梁、柱、电梯间、楼梯、机械连接、独立基础。钢筋和混凝土涉及具体型号了，自动生成的验收记,观察的不需要填，尺量的需要填，试验报告不需要填录里也不分。)
                        check_amount: "",//实际抽样数量
                        passed_amount: "",//合格数量
                        table_ids: {  //选中的台账主键
                            material_ids: [],//原材表选中的主键列表
                            connection_ids: [],//机械连接表选中的主键列表
                            weld_ids: [],//焊接表选中的主键列表
                            concrete_ids: [],//混凝土表选中的主键列表
                        },
                        extra_report_number: "",//额外的报告编号
                    }
                ]

            }
            let resultData = {
                data: []
            }
            this.tableData.forEach(item => {
                console.log("item", item)
                let data1 = {
                    task_id: String(this.taskId),
                    task_item_id: Number(item.taskItemId),
                    inspect_item_id: item.inspectItemId,
                    data_type: String(item.dataType),
                    fail_resample: 0,
                    data: [  //reportName
                        {
                            collector: this.collectorName,
                            inspect_part: item.inspectPart,
                            part_type: "",
                            check_amount: item.reportName.length,
                            passed_amount: item.reportName.length,
                            table_ids: {  //选中的台账主键
                                material_ids: [],//原材表选中的主键列表
                                connection_ids: [],//机械连接表选中的主键列表
                                weld_ids: [],//焊接表选中的主键列表
                                concrete_ids: [],//混凝土表选中的主键列表
                            },
                            extra_report_number: "",//额外的报告编号
                        }
                    ]
                }
                let extraReportNumber = []
                item.reportName.forEach(item => {
                    if (item.reportType === 1) {
                        console.log(item.reportType, item.dataId)
                        data1.data[0].table_ids.material_ids.push(item.dataId)
                    } else if (item.reportType === 2) {
                        data1.data[0].table_ids.connection_ids.push(item.dataId)
                    } else if (item.reportType === 3) {
                        data1.data[0].table_ids.weld_ids.push(item.dataId)
                    } else if (item.reportType === 4) {
                        data1.data[0].table_ids.concrete_ids.push(item.dataId)
                    } else {
                        extraReportNumber.push(item.reportNumber)
                    }
                })
                data1.data[0].extra_report_number = extraReportNumber.join(',')
                resultData.data.push(data1);
            });
            console.log("最终数据", resultData)//JSON.stringify(resultData)
            try {
                let res = await submitData(resultData)
                if (res.code == 200) {
                    this.$message.success("保存成功")
                    this.$router.push({
                        path: "taskList",
                    });

                } else {
                    throw new Error(res.message || "保存操作失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("出错啦，请稍后重试！");

            }

        }

    }
}
</script>

<style scoped>
.footer-buttons {
    margin-right: 8px;
    margin-top: 20px;
    padding-top: 10px;
    /* border-top: 1px solid #ebeef5; */
    display: flex;
    gap: 10px;
}

.filter-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.text-center {
    text-align: center;
}

.inline-block {
    display: inline-block;
}
</style>