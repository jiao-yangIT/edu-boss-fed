import request from '@/utils/request'

// 查询课程信息
export const getQueryCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架
export const changeState = params => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

// 保存或更改课程信息接口
export const saveOrUpdateCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 上传图片接口
export const UploadCourseImage = (data, onUploadProgress) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // 检测上传速度
    onUploadProgress
  })
}

// 通过课程 ID 获取课程信息的接口
export const getCourseById = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
