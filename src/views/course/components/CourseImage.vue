<template>
  <div class="course-image">
    <el-form-item :label="label">
      <!-- progress 组件 -->
      <el-progress
        v-if="isUploading"
        type="circle"
        :percentage="precentage"
        :width="178"
        :status="precentage === 100 ? 'success' : undefined"
      ></el-progress>
      <!-- upload 组件 -->
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
      >
        <!-- img 为预览图片的显示位置 -->
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import UploadCourseImage from '@/services/course'
export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 上传状态
      isUploading: false,
      // 上传百分比
      precentage: 0
    }
  },
  methods: {
    // 图片上传处理函数
    async handleUpload (option) {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', option.file)
      // 发送上传请求
      const { data } = await UploadCourseImage(fd, event => {
        this.precentage = Math.floor(event.loaded / event.total * 100)
        if (data.code === '000000') {
          this.$emit('input', data.data.name)
          this.isUploading = false
          // 上传成功后，进度条清0，避免下次会从100有回退情况
          this.precentage = 0
        }
      })
    },
    // 图片上传成功回调函数
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传之前回调函数
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style lang="scss" scoped>
 ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
