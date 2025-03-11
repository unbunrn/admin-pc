<template>
  <div class="body">
    <div class="top">
      <h2>管理员管理</h2>
      <div>
        <el-button @click="handleAdd">添加管理员</el-button>
        <el-input
          placeholder="请输入用户名"
          prefix-icon="el-icon-search"
          v-model="searchVal"
          @input="toSearch"
        >
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="password" label="密码"> </el-table-column>
      <el-table-column prop="nickname" label="昵称"> </el-table-column>
      <el-table-column prop="role" label="权限"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 访问当前行数据 -->
          <el-button
            type="primary"
            @click="editItem(scope.row)"
            style="margin-right: 20px"
            >编辑</el-button
          >
          <el-popconfirm
            @confirm="delAdmin(scope.row._id)"
            title="确认删除该数据吗"
          >
            <el-button type="danger" slot="reference"> 删除 </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="isEdit ? '编辑管理员' : '新增管理员'"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClsoe"
    >
      >
      <el-input
        class="margin"
        v-model="username"
        placeholder="请输入用户名"
      ></el-input>
      <el-input
        class="margin"
        v-model="password"
        placeholder="请输入密码"
      ></el-input>
      <el-input
        class="margin"
        v-model="nickname"
        placeholder="请输入昵称"
      ></el-input>
      <el-radio-group class="margin" v-model="role">
        <el-radio :label="0">超级管理员</el-radio>
        <el-radio :label="1">管理员</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddEditAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { debounce } from "lodash";
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      size: 5, // 每页显示条数
      total: 0,
      searchVal: "",
      dialogVisible: false,
      username: "",
      password: "",
      nickname: "",
      role: 0,
      _id: "",
      isEdit: false, // 是否是编辑状态
    };
  },
  methods: {
    handleClsoe() {
      this.username = "";
      this.password = "";
      this.nickname = "";
      this.role = 0;
      this._id = "";
      this.isEdit = false;
    },
    editItem(item) {
      // 编辑管理员
      this.isEdit = true;
      const { username, password, nickname, role, _id } = item;
      this.username = username;
      this.password = password;
      this.nickname = nickname;
      this.role = role === "超级管理员" ? 0 : 1;
      this._id = _id;
      this.dialogVisible = true;
    },
    handleAdd() {
      // 新增管理员
      this.isEdit = false;
      this.dialogVisible = true;
    },
    async AddEditAdmin() {
      // 对话框具体逻辑，添加或编辑管理员
      const { username, password, nickname, role, _id } = this;
      if (username == "" || password == "" || nickname == "") {
        this.$message.warning("请输入完整信息");
        return;
      }
      const params = {
        username,
        password,
        nickname,
        role,
        _id,
      };
      const { data } = await this.$http.post("/admin/AddEditAdmin", params);
      if (data == "success") {
        this.$message.success(_id ? "编辑成功" : "添加成功");
        if (_id === JSON.parse(localStorage.getItem("userInfo"))._id) {
          await this.getTableData("",_id);
        } else {
          await this.getTableData();
        }
        this.dialogVisible = false;
        this.handleClsoe();
      } else if (data == "exist") {
        this.$message.warning("用户名已存在");
      } else {
        this.$message.error(_id ? "编辑失败" : "添加失败");
      }
    },

    async toSearch() {
      let _toSearch = debounce(this.getTableData, 1000); //防抖,提高用户体验，减少请求次数
      _toSearch(this.searchVal);
    },

    async handleSizeChange(val) {
      // 改变每页显示条数
      this.size = val;
      await this.getTableData();
    },
    async handleCurrentChange(val) {
      // 改变当前页
      this.page = val;
      await this.getTableData();
    },

    async delAdmin(_id) {
      const params = {
        _id,
        username: JSON.parse(localStorage.getItem("userInfo")).username,
      };
      const { data } = await this.$http.post("/admin/delAdmin", params);
      if (data == "success") {
        this.$message.success("删除成功");
        await this.getTableData();
      } else if (data == "noPower") {
        this.$message.error("无权限删除");
      } else if (data == "cannotDeleteSelf") {
        this.$message.error("不能删除自己");
      } else {
        this.$message.error("删除失败");
      }
    },
    async getTableData(searchVal,_id) {
      let params = {};
      if (searchVal) {
        params = {
          page: this.page,
          size: this.size,
          searchVal,
        };
      } else {
        params = {
          page: this.page,
          size: this.size,
        };
      }
      const {
        data: { result, total },
      } = await this.$http.post("/admin/getAdmin", params);
      this.total = total;
      this.tableData = result.map((item) => {
        if(_id&&item._id===_id){
          localStorage.setItem("userInfo", JSON.stringify(item)); 
          window.location.reload();
        }
        item.create_time = dayjs(item.create_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        item.role = item.role == 0 ? "超级管理员" : "管理员";
        return item;
      });
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style lang="less" scoped>
.body {
  padding: 20px;
  background-color: white;
  border-radius: 20rpx;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box; // 防止padding撑大盒子
  margin-bottom: 20px;

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    h2 {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-input {
      width: 300px;
      margin-left: 20px;
    }
  }
}
.margin {
  margin-bottom: 20px;
}
</style>
